import { useEffect, useState } from 'react';
import { getGoogleVolume } from '@/api/googleBooks';

export function useGoogleVolume(id, opts = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getGoogleVolume(id, opts);
        if (active) setData(res);
      } catch (e) {
        if (active) setError(e.message || 'Failed to load volume');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id, JSON.stringify(opts)]);

  return { data, loading, error };
}