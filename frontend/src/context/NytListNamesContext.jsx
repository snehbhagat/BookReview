import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchNytListNames } from '@/api/nyt';

const Ctx = createContext(null);

export function NytListNamesProvider({ children }) {
  const [state, setState] = useState({ listNames: [], loading: true, error: '' });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchNytListNames();
        if (active) setState({ listNames: data.listNames || [], loading: false, error: '' });
      } catch (e) {
        if (active) setState({ listNames: [], loading: false, error: e.message || 'Failed' });
      }
    })();
    return () => { active = false; };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export function useNytNamesCtx() {
  return useContext(Ctx);
}