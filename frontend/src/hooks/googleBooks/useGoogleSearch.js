import { useEffect, useState } from 'react';
import { searchGoogleBooks } from '@/api/googleBooks';

export function useGoogleSearch({ q, orderBy = 'relevance', startIndex = 0, maxResults = 20, langRestrict = '', printType = '' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!q);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!q || !q.trim()) return;
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await searchGoogleBooks({ q, orderBy, startIndex, maxResults, langRestrict, printType });
        if (active) setData(res);
      } catch (e) {
        if (active) setError(e.message || 'Search failed');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [q, orderBy, startIndex, maxResults, langRestrict, printType]);

  return { data, items: data?.items || [], totalItems: data?.totalItems || 0, loading, error };
}