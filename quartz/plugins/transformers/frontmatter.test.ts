import test from "node:test"
import assert from "node:assert/strict"
import { unified } from "unified"
import remarkParse from "remark-parse"
import { VFile } from "vfile"
import { FrontMatter } from "./frontmatter"
import { BuildCtx } from "../../util/ctx"
import { FullSlug } from "../../util/path"

async function parse(slug: string, metadata: string) {
  const ctx = { allSlugs: [], cfg: { configuration: { locale: "en-US" } } } as unknown as BuildCtx
  const file = new VFile({ path: `${slug}.md`, value: `---\ntitle: Example\n${metadata}\n---\n` })
  file.data.slug = slug as FullSlug
  const parser = unified().use(remarkParse).use(FrontMatter().markdownPlugins!(ctx))
  await parser.run(parser.parse(file), file)
  return file.data.frontmatter
}

test("book covers are not treated as social sharing image paths", async () => {
  const fm = await parse("books/Example", 'cover: "[[assets/books/example.jpg]]"')
  assert.equal(fm?.cover, "[[assets/books/example.jpg]]")
  assert.equal(fm?.socialImage, undefined)
})

test("books can still explicitly set a social sharing image", async () => {
  const fm = await parse(
    "books/Example",
    'cover: "[[assets/books/example.jpg]]"\nsocialImage: social.jpg',
  )
  assert.equal(fm?.socialImage, "social.jpg")
})

test("cover remains a social image alias for existing non-book notes", async () => {
  const fm = await parse("notes/Example", "cover: social.jpg")
  assert.equal(fm?.socialImage, "social.jpg")
})
