import { useEffect, useState } from 'react';
import { fetchNytOverview } from '@/api/nyt';

export function useNytOverview(date = 'current') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchNytOverview(date);
        if (active) setData(res);
      } catch (e) {
        if (active) setError(e.message || 'Failed to load overview');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [date]);

  const lists = data?.lists || [];
  return { data, lists, loading, error };
}