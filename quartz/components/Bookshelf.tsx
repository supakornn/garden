import { Book, groupBooks } from "./bookData"
import { FullSlug, resolveRelative } from "../util/path"

export default function Bookshelf({
  books,
  currentSlug,
}: {
  books: Book[]
  currentSlug: FullSlug
}) {
  if (!books.length) {
    return <p class="bookshelf-empty">No books here yet. A little room for the next good read.</p>
  }

  return (
    <div class="bookshelf">
      {groupBooks(books).map((group, index) => (
        <section class="bookshelf-section" aria-labelledby={`shelf-${index}`} key={group.title}>
          <div class="bookshelf-heading">
            <h2 id={`shelf-${index}`}>{group.title}</h2>
            <span>
              {group.books.length} {group.books.length === 1 ? "book" : "books"}
            </span>
          </div>
          <ul class="book-grid" role="list">
            {group.books.map((book) => (
              <li class="book-card" key={book.slug}>
                <div class="book-cover">
                  {book.cover ? (
                    <img
                      src={resolveRelative(currentSlug, book.cover)}
                      alt={`Cover of ${book.title}`}
                      width="240"
                      height="360"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div class="book-cover-placeholder" aria-hidden="true">
                      <span>{book.title}</span>
                      <small>Cover not added</small>
                    </div>
                  )}
                </div>
                <h3>{book.title}</h3>
                {book.author && <p class="book-author">{book.author}</p>}
                {book.status === "read" &&
                  (book.finished ? (
                    <p class="book-finished">
                      Finished <time dateTime={book.finished}>{book.finished}</time>
                    </p>
                  ) : book.year ? (
                    <p class="book-finished">Read in {book.year}</p>
                  ) : null)}
                {book.takeaway && <p class="book-takeaway">{book.takeaway}</p>}
                {book.notes && (
                  <a
                    class="internal book-notes"
                    href={resolveRelative(currentSlug, book.notes)}
                    aria-label={`My notes on ${book.title}`}
                  >
                    My notes <span aria-hidden="true">→</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
