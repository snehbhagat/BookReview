import api from './axios';

// List names
export async function fetchNytListNames() {
  const { data } = await api.get('/api/nyt/list-names');
  return data;
}

// Overview (date can be 'current' or YYYY-MM-DD)
export async function fetchNytOverview(date = 'current') {
  const qs = new URLSearchParams();
  if (date && date !== 'current') qs.set('date', date);
  const { data } = await api.get(`/api/nyt/overview${qs.toString() ? '?' + qs.toString() : ''}`);
  return data;
}

// Individual list
export async function fetchNytList({ name, date = 'current', offset = 0 }) {
  const qs = new URLSearchParams({ name });
  if (date && date !== 'current') qs.set('date', date);
  if (offset) qs.set('offset', offset);
  const { data } = await api.get(`/api/nyt/list?${qs.toString()}`);
  return data;
}