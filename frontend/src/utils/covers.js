export function openLibraryCoverFromIsbn(isbn13, size = 'L') {
  if (!isbn13) return null;
  return `https://covers.openlibrary.org/b/isbn/${isbn13}-${size}.jpg`;
}