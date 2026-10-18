# Bookshelf

The public `/books/` page is a cover-first bookshelf. Book records are Markdown files in `content/books/`; longer notes remain in `content/notes/`. No Obsidian plugin or external service is required.

## Add a book in Obsidian

1. Create a note inside **books**, using `content/Templates/Book.md` as a starting point.
2. Paste the book cover into the **body of the note**, below its properties. Let Obsidian save it in your usual **attachments** folder—no moving or renaming required. The bookshelf automatically uses the first existing local image in the note (JPG, PNG, WebP, GIF, AVIF, or SVG). Both `![[...]]` embeds and Markdown images work.
3. Fill in **title**, **author**, and optionally **year**. Leave year blank for a book you are reading; fill it in when you have read the book. No status property is needed. If title is left blank, Quartz uses the filename.

```markdown
---
title: Clean Architecture
author: Robert C. Martin
year: 2026
---

![[Pasted image 20261018225114.png]]
```

- **title:** the book title. Kept in the template; if blank, the filename is used.
- **author:** the author's name.
- **year:** the four-digit year you read the book, for example `2026`. Numbers and quoted strings both work. When status is omitted, a valid year puts the book under **Read · 2026** and shows **Read in 2026** on its card. Blank or invalid year means **Currently reading**. No exact completion date is required.

## Optional properties

Add these only when useful. Paths are relative to the published vault root (`content/`), not the book record. Quote Obsidian links in YAML. Links with a `content/` prefix also work when the repository itself is your Obsidian vault.

- **status:** optional compatibility override: `reading` or `read`. Existing explicit values take priority over automatic inference. Use `read` without a year only if you finished a book but do not remember when; it appears under **Date not recorded**. The template no longer includes status.
- **finished:** a full `YYYY-MM-DD` completion date, for example `"2026-04-07"`, if you prefer recording the exact day. Existing dates still work. A valid `finished` date takes precedence over `year` to avoid displaying conflicting years. Read books without either a valid date or year appear under **Date not recorded**.
- **cover:** optional override for the automatically detected image. A valid local path or quoted Obsidian link takes precedence, for example `cover: "[[attachments/My cover.png]]"`. Leave it blank or omit it to use the first existing local image in the body. An invalid override falls back to the body image. Images can live anywhere in published content; no special cover folder is required. Missing, remote, and malformed images are skipped. If no usable image exists, the card shows a text fallback.
- **notes:** an Obsidian link to an existing published note. Add this property only for books with notes; type `[[` in Obsidian and choose the note, for example `notes: "[[notes/Clean Architecture]]"`. Missing, ambiguous, and unpublished targets do not create a link. Links to headings are not supported in this field.
- **takeaway:** optional one-sentence thought shown below the author.
- **socialImage:** optional explicit Quartz social sharing image, separate from the book cover. The `cover` property does not become a social image alias for book records.
- **draft:** set to `true` to keep a book record unpublished, using the existing Quartz draft filter.

All properties are optional; Quartz uses the filename when `title` is omitted. A book without notes remains a complete bookshelf entry, not a broken link. If you want your note link visible in the book record itself in Obsidian, add a normal `[[notes/Your note]]` link in its body too. The bookshelf displays metadata and the detected cover, not other record body text. Images inside code examples are not treated as covers.

## Initial content

`books/Clean Architecture.md` links to the existing reading note. Its status, completion date, and cover are deliberately unset rather than guessed. Paste your cover and fill in the year once read.

## Design and scope

- Existing garden fonts and light/dark colour tokens; no new dependencies or client-side scripts.
- Cover-first grid, currently reading first, then read books by year.
- Four columns on desktop, three on smaller screens, two on mobile, one on very narrow screens.
- Uniform 2:3 cover frames with `object-fit: cover`, reserved image space, lazy loading, visible titles/authors and keyboard-accessible notes links. Images fill the frame without stretching; differing proportions may crop the edges slightly. Covers gently zoom on hover without shifting the layout; the animation is disabled for touch-only devices and reduced-motion preferences.
- No ratings, filters, goals, external book services, or homepage preview in this version.

## Implementation and verification

`quartz/components/bookData.ts` resolves metadata and groups books. `Bookshelf.tsx` renders the grid. `pages/FolderContent.tsx` uses it only for `books/index`; other folder pages are unchanged. Scoped styles live in `quartz/styles/custom.scss`.

Run `npm test`, `npx tsc --noEmit`, and `npx quartz build`. Preview with `npx quartz build --serve` and open `/books/`. Tests cover local and Obsidian links, missing/ambiguous targets, draft records, date/year validation, year-only reading records, grouping, pasted-image detection, cover overrides, rendering, and empty state.
