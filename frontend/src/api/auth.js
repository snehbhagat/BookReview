import api from './axios';

// Create account (backend route is /signup)
export async function signup(data) {
  const res = await api.post('/api/auth/signup', data);
  return res.data; // { user, token }
}

export async function login(data) {
  const res = await api.post('/api/auth/login', data);
  return res.data; // { user, token }
}

export async function loginWithGoogle(credential) {
  // credential can be a string or an object; backend accepts { credential } too
  const body = typeof credential === 'string' ? { credential } : credential;
  const res = await api.post('/api/auth/oauth/google', body);
  return res.data; // { user, token }
}
