import test from "node:test"
import assert from "node:assert/strict"
import { h } from "preact"
import { renderToString } from "preact-render-to-string"
import { collectBooks, groupBooks, resolveBookReference } from "./bookData"
import Bookshelf from "./Bookshelf"
import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug } from "../util/path"

function file(slug: string, fields: Record<string, unknown> = {}): QuartzPluginData {
  return { slug: slug as FullSlug, frontmatter: { title: slug, ...fields } }
}

const slugs = ["notes/Clean-Architecture", "assets/books/Clean-Cover.jpg"] as FullSlug[]

test("resolves vault paths and quoted Obsidian links, including spaces and aliases", () => {
  assert.equal(resolveBookReference("[[notes/Clean Architecture|Notes]]", slugs), slugs[0])
  assert.equal(resolveBookReference("notes/Clean Architecture.md", slugs), slugs[0])
  assert.equal(resolveBookReference("[[Clean Architecture]]", slugs), slugs[0])
  assert.equal(resolveBookReference("![[assets/books/Clean Cover.jpg]]", slugs), slugs[1])
  assert.equal(resolveBookReference("[[content/notes/Clean Architecture]]", slugs), slugs[0])
  assert.equal(resolveBookReference("[[content/assets/books/Clean Cover.jpg]]", slugs), slugs[1])
})

test("does not produce links to missing, ambiguous, or external references", () => {
  assert.equal(resolveBookReference("[[Missing]]", slugs), undefined)
  assert.equal(resolveBookReference("https://example.com/a.jpg", slugs), undefined)
  assert.equal(resolveBookReference("javascript:alert(1)", slugs), undefined)
  assert.equal(resolveBookReference("../private/file", slugs), undefined)
  assert.equal(resolveBookReference("[[Same]]", ["a/Same", "b/Same"] as FullSlug[]), undefined)
})

test("collects only book records and resolves covers and published notes", () => {
  const files = [
    file("books/index"),
    file("books/Example", {
      title: "Example",
      author: "An Author",
      status: "reading",
      cover: "[[assets/books/Clean Cover.jpg]]",
      notes: "[[notes/Clean Architecture]]",
      takeaway: "Keep the important ideas close.",
    }),
    file("notes/Clean-Architecture"),
    file("books/Draft", { draft: true }),
    file("books/String-draft", { draft: "true" }),
  ]
  const books = collectBooks(files, slugs)
  assert.equal(books.length, 1)
  assert.equal(books[0].status, "reading")
  assert.equal(books[0].cover, slugs[1])
  assert.equal(books[0].notes, slugs[0])
  assert.equal(books[0].takeaway, "Keep the important ideas close.")
})

test("defaults to reading without inventing a completion date or notes", () => {
  const [book] = collectBooks(
    [file("books/Example", { status: "unknown", finished: "2026-02-30" })],
    [],
  )
  assert.equal(book.status, "reading")
  assert.equal(book.finished, undefined)
  assert.equal(book.notes, undefined)
  assert.equal(book.cover, undefined)
})

test("groups finished books by year, newest first, with undated books last", () => {
  const books = collectBooks(
    [
      file("books/Old", { status: "read", finished: "2024-03-01" }),
      file("books/New", { status: "read", finished: "2026-04-01" }),
      file("books/Newer", { status: "read", finished: "2026-05-01" }),
      file("books/Undated", { status: "read" }),
      file("books/Reading", { status: "reading" }),
      file("books/Unassigned"),
    ],
    [],
  )
  const groups = groupBooks(books)
  assert.deepEqual(
    groups.map((group) => group.title),
    ["Currently reading", "Read · 2026", "Read · 2024", "Read · Date not recorded"],
  )
  assert.deepEqual(
    groups[1].books.map((book) => book.slug),
    ["books/Newer", "books/New"],
  )
})

test("renders covers, a non-clickable fallback, and only valid notes links", () => {
  const files = [
    file("books/Covered", {
      title: "Covered",
      cover: "assets/books/Clean Cover.jpg",
      notes: "[[notes/Clean Architecture]]",
    }),
    file("books/No-cover", { title: "No cover", author: "Author", notes: "[[Missing]]" }),
    file("notes/Clean-Architecture"),
  ]
  const html = renderToString(
    h(Bookshelf, { books: collectBooks(files, slugs), currentSlug: "books/index" as FullSlug }),
  )
  assert.match(html, /src="\.\.\/assets\/books\/Clean-Cover.jpg"/)
  assert.match(html, /href="\.\.\/notes\/Clean-Architecture"/)
  assert.match(html, /Cover not added/)
  assert.equal((html.match(/class="internal book-notes"/g) ?? []).length, 1)
  assert.doesNotMatch(html, /href="[^\"]*books\/No-cover/)
})

test("infers read from a year or finished date and reading when no year is given", () => {
  const books = collectBooks(
    [
      file("books/Done", { year: 2026 }),
      file("books/Blank-status", { status: "", year: "2025" }),
      file("books/Exact", { finished: "2024-03-01" }),
      file("books/Reading"),
      file("books/Empty-year", { year: null }),
      file("books/Invalid-year", { year: "true" }),
    ],
    [],
  )
  assert.deepEqual(
    books.map((book) => book.status),
    ["read", "read", "read", "reading", "reading", "reading"],
  )
  assert.deepEqual(
    groupBooks(books).map((group) => group.title),
    ["Currently reading", "Read · 2026", "Read · 2025", "Read · 2024"],
  )
})

test("accepts a reading year without requiring an exact completion date", () => {
  const books = collectBooks(
    [
      file("books/Year-number", { status: "read", year: 2026 }),
      file("books/Year-text", { status: "read", year: "2025" }),
      file("books/Exact-date", { status: "read", finished: "2024-03-01", year: 2023 }),
    ],
    [],
  )
  assert.deepEqual(
    books.map((book) => book.year),
    ["2026", "2025", "2024"],
  )
  assert.equal(books[0].finished, undefined)
  assert.deepEqual(
    groupBooks(books).map((group) => group.title),
    ["Read · 2026", "Read · 2025", "Read · 2024"],
  )
  const html = renderToString(h(Bookshelf, { books, currentSlug: "books/index" as FullSlug }))
  assert.match(html, /Read in 2026/)
  assert.match(html, /datetime="2024-03-01"/)
})

test("rejects invalid reading years without guessing a date", () => {
  for (const year of [true, "true", 26, 2026.5, "2026-04-01", "", null]) {
    assert.equal(
      collectBooks([file("books/Invalid", { status: "read", year })], [])[0].year,
      undefined,
    )
  }
  const books = collectBooks([file("books/Reading", { status: "reading", year: 2026 })], [])
  assert.equal(groupBooks(books)[0].title, "Currently reading")
  const html = renderToString(h(Bookshelf, { books, currentSlug: "books/index" as FullSlug }))
  assert.doesNotMatch(html, /Read in 2026/)
})

test("uses the first pasted local image when the cover property is empty or absent", () => {
  const book = file("books/Example", { cover: "" })
  book.htmlAst = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "p",
        properties: {},
        children: [
          {
            type: "element",
            tagName: "img",
            properties: { src: "../attachments/Pasted-image-20261018225114.png" },
            children: [],
          },
          {
            type: "element",
            tagName: "img",
            properties: { src: "../attachments/Second.png" },
            children: [],
          },
        ],
      },
    ],
  }
  const assets = [
    "attachments/Pasted-image-20261018225114.png",
    "attachments/Second.png",
  ] as FullSlug[]
  assert.equal(collectBooks([book], assets)[0].cover, assets[0])
  delete book.frontmatter!.cover
  assert.equal(collectBooks([book], assets)[0].cover, assets[0])
})

test("an explicit cover overrides a pasted image", () => {
  const book = file("books/Example", { cover: "[[assets/books/Clean Cover.jpg]]" })
  book.htmlAst = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "img",
        properties: { src: "../attachments/Pasted.png" },
        children: [],
      },
    ],
  }
  assert.equal(
    collectBooks([book], [...slugs, "attachments/Pasted.png" as FullSlug])[0].cover,
    slugs[1],
  )
})

test("ignores remote, missing, and malformed images when finding a pasted cover", () => {
  const book = file("books/Example")
  book.htmlAst = {
    type: "root",
    children: [
      ...[
        "https://example.com/remote.png",
        "../attachments/Missing.png",
        "../attachments/%.png",
        "../attachments/Actual.png",
      ].map((src) => ({
        type: "element" as const,
        tagName: "img",
        properties: { src },
        children: [],
      })),
    ],
  }
  const assets = ["attachments/Actual.png"] as FullSlug[]
  assert.equal(collectBooks([book], assets)[0].cover, assets[0])
  assert.equal(collectBooks([book], [])[0].cover, undefined)
})

test("renders an honest empty state without example books", () => {
  const html = renderToString(h(Bookshelf, { books: [], currentSlug: "books/index" as FullSlug }))
  assert.match(html, /No books here yet/)
  assert.doesNotMatch(html, /<li/)
})
