import { useEffect, useState } from 'react';
import { fetchNytList } from '@/api/nyt';

export function useNytList({ name, date = 'current', offset = 0 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!name);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!name) return;
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchNytList({ name, date, offset });
        if (active) setData(res);
      } catch (e) {
        if (active) setError(e.message || 'Failed to load list');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [name, date, offset]);

  const entries = data?.entries || [];
  return { data, entries, loading, error };
}