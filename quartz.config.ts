import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { GeistFonts } from "./quartz/plugins/emitters/geistFonts"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "supakorn.me",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "supakorn.me",
    ignorePatterns: ["private", "templates"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "local",
      cdnCaching: true,
      typography: {
        header: "Geist Serif",
        body: "Geist Serif",
        code: "Geist Mono",
      },
      colors: {
        lightMode: {
          light: "#ffffff",
          lightgray: "#e4e4e7",
          gray: "#a1a1aa",
          darkgray: "#3f3f46",
          dark: "#18181b",
          secondary: "#52525b",
          tertiary: "#18181b",
          highlight: "#f4f4f5",
          textHighlight: "#d4d4d8",
        },
        darkMode: {
          light: "#18181b",
          lightgray: "#3f3f46",
          gray: "#71717a",
          darkgray: "#d4d4d8",
          dark: "#f4f4f5",
          secondary: "#d4d4d8",
          tertiary: "#ffffff",
          highlight: "#27272a",
          textHighlight: "#52525b",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.Poetry(),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.SyntaxHighlighting(),
      Plugin.ObsidianFlavoredMarkdown({
        enableInHtmlEmbed: false,
        parseTags: false,
        mermaid: false,
      }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest", lazyLoad: true }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.ClickableImages(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      GeistFonts(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages({ font: "Geist" }),
    ],
  },
}

export default config
