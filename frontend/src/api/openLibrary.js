import api from './axios';

/**
 * Search Open Library through backend proxy.
 * @param {Object} opts
 * @param {string} opts.q - search query
 * @param {number} [opts.page=1]
 * @param {number} [opts.limit=20]
 */
export async function searchOpenLibrary({ q, page = 1, limit = 20 }) {
  const params = new URLSearchParams({ q, page, limit });
  const { data } = await api.get(`/api/open/search?${params.toString()}`);
  return data;
}

/**
 * Fetch book details by isbn OR olid (edition OLID)
 */
export async function fetchOpenBookDetails({ isbn, olid }) {
  const params = new URLSearchParams();
  if (isbn) params.set('isbn', isbn);
  if (olid) params.set('olid', olid);
  const { data } = await api.get(`/api/open/book?${params.toString()}`);
  return data;
}