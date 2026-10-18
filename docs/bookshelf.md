# Bookshelf

The public `/books/` page is a cover-first bookshelf. Book records are Markdown files in `content/books/`; longer notes remain in `content/notes/`. No Obsidian plugin or external service is required.

## Add a book in Obsidian

1. Create a note inside **books**, using `content/templates/Book.md` as a starting point. The templates folder is excluded from publication by the existing Quartz configuration.
2. Add a cover image under **assets/books** (JPG, PNG, WebP, GIF, AVIF, or SVG).
3. Fill in its properties. Paths are relative to the published vault root (`content/`), not the book record. Quote Obsidian links in YAML. If you opened the entire repository as your Obsidian vault, links with a `content/` prefix work too, such as `[[content/notes/Clean Architecture]]`.

```yaml
---
title: Clean Architecture
author: Robert C. Martin
status: reading
cover: "[[assets/books/clean-architecture.jpg]]"
notes: "[[notes/Clean Architecture]]"
finished: ""
takeaway: ""
---
```

- **status:** `reading` or `read`. Blank or omitted status puts the book under **On the shelf**, without claiming you have started or finished it.
- **finished:** optional `YYYY-MM-DD` completion date, for example `"2026-04-07"`. Only `read` books use it. They are grouped by year, newest first. Undated read books appear under **Date not recorded**. Invalid dates are treated as undated.
- **cover:** optional local image path or quoted Obsidian link. The image must exist in the published content. A plain path such as `assets/books/clean-architecture.jpg` also works. Missing images get a text fallback. Remote URLs are not supported.
- **notes:** optional quoted Obsidian link to an existing published note. Full vault paths are recommended; unique filenames also work. Missing, ambiguous, and unpublished targets do not create a link. Links to headings are not supported in this field.
- **takeaway:** optional one-sentence thought shown below the author.
- **socialImage:** optional explicit Quartz social sharing image, separate from the book cover. The `cover` property does not become a social image alias for book records.
- **draft:** set to `true` to keep a book record unpublished, using the existing Quartz draft filter.

All properties except `title` are optional. A book without notes remains a complete bookshelf entry, not a broken link. If you want your note link visible in the book record itself in Obsidian, add a normal `[[notes/Your note]]` link in its body too. The bookshelf displays metadata, not record body text.

## Initial content

`books/Clean Architecture.md` links to the existing reading note. Its status, completion date, and cover are deliberately unset rather than guessed. Add your cover and set its status when ready.

## Design and scope

- Existing garden fonts and light/dark colour tokens; no new dependencies or client-side scripts.
- Cover-first grid, currently reading first, then read books by year, then unassigned books.
- Four columns on desktop, three on smaller screens, two on mobile, one on very narrow screens.
- Entire cover visible, reserved image space, lazy loading, visible titles/authors and keyboard-accessible notes links.
- No ratings, filters, goals, external book services, or homepage preview in this version.

## Implementation and verification

`quartz/components/bookData.ts` resolves metadata and groups books. `Bookshelf.tsx` renders the grid. `pages/FolderContent.tsx` uses it only for `books/index`; other folder pages are unchanged. Scoped styles live in `quartz/styles/custom.scss`.

Run `npm test`, `npx tsc --noEmit`, and `npx quartz build`. Preview with `npx quartz build --serve` and open `/books/`. Tests cover local and Obsidian links, missing/ambiguous targets, draft records, date validation, grouping, rendering, and empty state.
