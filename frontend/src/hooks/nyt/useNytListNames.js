import { useEffect, useState } from 'react';
import { fetchNytListNames } from '@/api/nyt';

export function useNytListNames() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchNytListNames();
        if (active) setData(res);
      } catch (e) {
        if (active) setError(e.message || 'Failed to load list names');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return { data, listNames: data?.listNames || [], loading, error };
}