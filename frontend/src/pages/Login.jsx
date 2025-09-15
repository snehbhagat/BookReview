import { login, loginWithGoogle } from '@/api/auth';
import GoogleSignIn from '@/components/auth/GoogleSignIn';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/layouts/AuthLayout';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveAuth } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function validate() {
    const fieldErrors = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) fieldErrors.email = 'Valid email required';
    if (!form.password) fieldErrors.password = 'Password required';
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const { user, token } = await login({ email: form.email.trim().toLowerCase(), password: form.password });
      saveAuth(user, token);
      const redirect = (location.state && location.state.from) || '/';
      navigate(redirect, { replace: true });
    } catch (err) {
      setErrors({ form: err.response?.data?.error || 'Login failed' });
    } finally {
      setSubmitting(false);
    }
  }

  function onGoogleSuccess(payloadOrString) {
    // backend accepts either { credential } or raw string
    let credential = null;
    if (!payloadOrString) {
      setErrors({ form: 'Google sign-in failed: missing credential' });
      return;
    }
    if (typeof payloadOrString === 'string') credential = payloadOrString;
    else if (payloadOrString.credential) credential = payloadOrString.credential;
    else if (payloadOrString.token) credential = payloadOrString.token;
    else credential = payloadOrString; // fallback - let backend validate

    loginWithGoogle(credential)
      .then(({ user, token }) => {
        saveAuth(user, token);
        navigate('/', { replace: true });
      })
      .catch(err => {
        setErrors({ form: err.response?.data?.error || 'Google sign-in failed' });
      });
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue discovering and tracking books."
    >
      <form onSubmit={onSubmit} className="space-y-8">
        {errors.form && (
          <div className="rounded-md border border-red-300 bg-red-50 px-3 py-3 text-base text-red-700 dark:border-red-500 dark:bg-red-900/30 dark:text-red-300">
            {errors.form}
          </div>
        )}

        <FormField label="Email" htmlFor="email" error={errors.email} required>
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => update('email', e.target.value)}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password}
          required
        >
          <TextInput
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={form.password}
            onChange={e => update('password', e.target.value)}
          />
        </FormField>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-base text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={e => update('remember', e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-base font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          loading={submitting}
          className="w-full shadow-lg"
          size="lg"
        >
          Sign In
        </Button>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white/90 dark:bg-[#0f1714]/90 px-4 text-base uppercase tracking-wider text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleSignIn
          onSuccess={onGoogleSuccess}
          onError={(e) => setErrors({ form: e.message || 'Google auth error' })}
        />

        <p className="text-center text-lg text-gray-600 dark:text-gray-400 pt-4">
          New here?{' '}
          <Link
            to="/signup"
            className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
