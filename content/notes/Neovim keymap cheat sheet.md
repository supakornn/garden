---
created: 2026-11-07
---
My neovim config: https://github.com/supakornn/dotfiles

Leader is **Space**. Press Space and pause to discover shortcuts.
Most shortcuts below are used in **Normal mode**. Plugin shortcuts follow LazyVim defaults and may vary with locally installed versions; use the in-editor help to confirm.
### Essentials

- `Esc` or `jk` — exit Insert mode (this config uses `jk`, not `jj`).
- `i` / `a` — insert before / after the cursor.
- `o` / `O` — insert a new line below / above.
- `Space w` — save the file.
- `u` / `Ctrl-r` — undo / redo.
- `Space qq` — quit all windows; unsaved changes may require saving first.

### Find and open

- `Space Space` or `Space sf` — find files.
- `Space sg` — search text across the project.
- `Space ,` — switch buffers.
- `Space e` — open the file explorer.
- `Space so` or `Space ss` — find symbols in the current file.

### File explorer

These keys apply while focused in the explorer.

- `j` / `k` — move down / up.
- `Enter` — open a file or directory.
- `h` / `l` — close a directory / open a directory.
- `a` — create a file; end the name with `/` for a directory.
- `m` — move or rename a file (enter its new path).
- `Tab` — select files.
- `x` / `y` / `p` — cut / copy / paste.
- `d` — delete selected files; check the confirmation.
- `?` — show explorer shortcuts.

### Move files to another directory

- Single file: highlight it, press `m`, enter the new path, and press Enter.
- Multiple files: select them with Tab, press `x`, navigate to the destination directory, and press `p`.
- Create a directory first if needed: press `a` and enter a name ending in `/`.

### Move around

- `h` / `j` / `k` / `l` — left / down / up / right.
- `w` / `b` — next / previous word.
- `0` / `^` / `$` — line start / first nonblank character / line end.
- `gg` / `G` — top / bottom of the file.
- `Ctrl-d` / `Ctrl-u` — scroll half a page down / up.
- `%` — jump to the matching bracket.
- `Ctrl-o` / `Ctrl-i` — jump backward / forward through jump history.

### Edit and select

- `v` / `V` / `Ctrl-v` — character / line / block selection.
- `yy` / `dd` — copy / delete a line.
- `p` / `P` — paste after / before.
- `ciw` — replace the word under the cursor.
- `ci"` — replace text inside double quotes.
- `>` / `<` in Visual mode — indent / unindent the selection.
- `.` — repeat the last edit.
- `gcc` — toggle a line comment.
- `gc` in Visual mode — toggle comments on the selection.

### Search

- `/text` then Enter — search in the file.
- `n` / `N` — next / previous match.
- `*` — search for the word under the cursor.
- `Esc` in Normal mode — clear search highlighting.

### Code navigation

Language-server features require a working server for the current file.

- `gd` — go to definition.
- `gr` — find references.
- `K` — hover documentation.
- `Space cr` — rename a symbol.
- `Space ca` — code actions.
- `Space cf` — format.
- `[d` / `]d` — previous / next diagnostic.
- `Space ud` — toggle diagnostics.

### Buffers and splits

- `Shift-h` / `Shift-l` — previous / next buffer.
- `Space '` — return to the previous buffer.
- `Space bd` — delete the current buffer.
- `Space |` — vertical split.
- `Space -` — horizontal split.
- `Ctrl-h/j/k/l` — navigate splits and Herdr panes.

### Gits

- `Space gg` — open LazyGit.
- `Space gd` — Git diff picker.