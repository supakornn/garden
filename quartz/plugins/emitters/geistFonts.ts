import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { QuartzEmitterPlugin } from "../types"
import { FullSlug } from "../../util/path"
import { write } from "./helpers"

// Resolve the package without executing its Next.js-specific font loaders.
const require = createRequire(import.meta.url)
const fontDirectory = resolve(dirname(require.resolve("geist/font/sans")), "fonts")
const fonts = [
  ["geist-serif", "GeistSerif-Regular"],
  ["geist-mono", "GeistMono-Variable"],
  ["geist-mono", "GeistMono-Italic[wght]"],
]

export const GeistFonts: QuartzEmitterPlugin = () => ({
  name: "GeistFonts",
  async *emit(ctx) {
    for (const [family, name] of fonts) {
      yield write({
        ctx,
        slug: `static/fonts/${name}` as FullSlug,
        ext: ".woff2",
        content: await readFile(resolve(fontDirectory, family, `${name}.woff2`)),
      })
    }

    yield write({
      ctx,
      slug: "static/fonts/geist-license" as FullSlug,
      ext: ".txt",
      content: await readFile(resolve(fontDirectory, "../../LICENSE.txt")),
    })
  },
})
