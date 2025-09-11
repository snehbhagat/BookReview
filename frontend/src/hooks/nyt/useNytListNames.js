import { useEffect, useState } from 'react';
import { fetchNytListNames } from '@/api/nyt';

let LIST_NAMES_CACHE = null;
let LIST_NAMES_PROMISE = null;
let LIST_NAMES_ERROR = null;
let LAST_FETCH = 0;
const TTL_MS = 2 * 60 * 60 * 1000; // 2h align with backend

export function useNytListNames() {
  const [data, setData] = useState(LIST_NAMES_CACHE);
  const [error, setError] = useState(LIST_NAMES_ERROR ? LIST_NAMES_ERROR.message : '');
  const [loading, setLoading] = useState(!LIST_NAMES_CACHE);

  useEffect(() => {
    const now = Date.now();
    const expired = !LAST_FETCH || (now - LAST_FETCH) > TTL_MS;

    if (LIST_NAMES_CACHE && !expired) {
      setData(LIST_NAMES_CACHE);
      setLoading(false);
      return;
    }
    if (LIST_NAMES_PROMISE) {
      setLoading(true);
      LIST_NAMES_PROMISE.then(
        res => setData(res),
        err => setError(err.message || 'Failed to load list names')
      ).finally(() => setLoading(false));
      return;
    }

    LIST_NAMES_PROMISE = (async () => {
      try {
        const res = await fetchNytListNames();
        LIST_NAMES_CACHE = res;
        LIST_NAMES_ERROR = null;
        LAST_FETCH = Date.now();
        return res;
      } catch (e) {
        LIST_NAMES_ERROR = e;
        throw e;
      } finally {
        LIST_NAMES_PROMISE = null;
      }
    })();

    setLoading(true);
    LIST_NAMES_PROMISE.then(
      res => setData(res),
      err => setError(err.message || 'Failed to load list names')
    ).finally(() => setLoading(false));
  }, []);

  return {
    data,
    listNames: data?.listNames || [],
    loading,
    error
  };
}