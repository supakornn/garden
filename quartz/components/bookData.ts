import { QuartzPluginData } from "../plugins/vfile"
import { FilePath, FullSlug, slugifyFilePath } from "../util/path"
import { EXIT, visit } from "unist-util-visit"

export interface Book {
  slug: FullSlug
  title: string
  author?: string
  status: "reading" | "read"
  finished?: string
  year?: string
  cover?: FullSlug
  notes?: FullSlug
  takeaway?: string
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

/** Resolve vault-root paths or unique filenames, never remote URLs or missing files. */
export function resolveBookReference(value: unknown, candidates: FullSlug[]): FullSlug | undefined {
  let reference = text(value)
  if (!reference) return
  reference = reference
    .replace(/^!?\[\[(.*)\]\]$/, "$1")
    .split("|")[0]
    .trim()
  if (/[:#?\\]/.test(reference) || reference.split("/").includes("..")) return
  let target = slugifyFilePath(reference as FilePath)
  if (candidates.includes(target)) return target
  // Also support Obsidian vaults opened at the repository root.
  if (target.startsWith("content/")) target = target.slice("content/".length) as FullSlug
  if (candidates.includes(target)) return target
  const matches = candidates.filter((slug) => slug.endsWith(`/${target}`))
  return matches.length === 1 ? matches[0] : undefined
}

function finishedDate(value: unknown): string | undefined {
  const date = text(value)
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return
  const parsed = new Date(`${date}T00:00:00Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date
    ? date
    : undefined
}

function readingYear(value: unknown): string | undefined {
  const year = typeof value === "number" ? String(value) : text(value)
  return year && /^[1-9]\d{3}$/.test(year) ? year : undefined
}

/** Read images already parsed and resolved by Quartz, including Obsidian paste embeds. */
function pastedCover(file: QuartzPluginData, covers: FullSlug[]): FullSlug | undefined {
  if (!file.htmlAst || !file.slug) return
  const base = new URL(file.slug, "https://quartz.invalid/")
  let cover: FullSlug | undefined
  visit(file.htmlAst, "element", (node) => {
    if (node.tagName !== "img" || typeof node.properties.src !== "string") return
    try {
      const url = new URL(node.properties.src, base)
      if (url.origin !== base.origin) return
      const target = decodeURIComponent(url.pathname.slice(1)) as FullSlug
      if (covers.includes(target)) {
        cover = target
        return EXIT
      }
    } catch {
      // A malformed or missing image must not break the bookshelf build.
    }
  })
  return cover
}

export function collectBooks(files: QuartzPluginData[], allSlugs: FullSlug[]): Book[] {
  const published = files.filter(
    (file) => file.frontmatter?.draft !== true && file.frontmatter?.draft !== "true",
  )
  const noteSlugs = published.flatMap((file) => (file.slug ? [file.slug] : []))
  const covers = allSlugs.filter((slug) => /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(slug))
  return published
    .filter((file) => file.slug?.startsWith("books/") && !file.slug.endsWith("/index"))
    .map((file) => {
      const fm = file.frontmatter!
      const finished = finishedDate(fm.finished)
      const year = finished?.slice(0, 4) ?? readingYear(fm.year)
      const status: Book["status"] =
        fm.status === "reading" || fm.status === "read" ? fm.status : year ? "read" : "reading"
      return {
        slug: file.slug!,
        title: fm.title,
        author: text(fm.author),
        status,
        finished,
        year,
        cover: resolveBookReference(fm.cover, covers) ?? pastedCover(file, covers),
        notes: resolveBookReference(fm.notes, noteSlugs),
        takeaway: text(fm.takeaway),
      }
    })
}

export function groupBooks(books: Book[]): { title: string; books: Book[] }[] {
  const alphabetical = (a: Book, b: Book) => a.title.localeCompare(b.title)
  const reading = books.filter((book) => book.status === "reading").sort(alphabetical)
  const read = books
    .filter((book) => book.status === "read")
    .sort(
      (a, b) =>
        (b.year ?? "").localeCompare(a.year ?? "") ||
        (b.finished ?? "").localeCompare(a.finished ?? "") ||
        alphabetical(a, b),
    )
  const years = [...new Set(read.map((book) => book.year ?? "Date not recorded"))]
  return [
    { title: "Currently reading", books: reading },
    ...years.map((year) => ({
      title: `Read · ${year}`,
      books: read.filter((book) => (book.year ?? "Date not recorded") === year),
    })),
  ].filter((group) => group.books.length > 0)
}
