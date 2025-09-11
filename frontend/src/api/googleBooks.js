import api from './axios';

export async function searchGoogleBooks({ q, orderBy = 'relevance', startIndex = 0, maxResults = 20, langRestrict = '', printType = '' }) {
  const params = new URLSearchParams({ q, orderBy, startIndex, maxResults });
  if (langRestrict) params.set('langRestrict', langRestrict);
  if (printType) params.set('printType', printType);
  const { data } = await api.get(`/api/books/search?${params.toString()}`);
  return data;
}

export async function getGoogleVolume(id, opts = {}) {
  const params = new URLSearchParams();
  if (opts.country) params.set('country', opts.country);
  const { data } = await api.get(`/api/books/volume/${encodeURIComponent(id)}${params.toString() ? `?${params}` : ''}`);
  return data;
}