import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import Button from '@/components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.email) e.email = 'Email required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      // TODO: call your auth API
      await new Promise(r => setTimeout(r, 900));
      const redirect = (location.state && location.state.from) || '/';
      navigate(redirect, { replace: true });
    } catch (err) {
      setErrors({ form: err.message || 'Login failed' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue discovering and tracking books."
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {errors.form && (
          <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500 dark:bg-red-900/30 dark:text-red-300">
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={e => update('remember', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          loading={submitting}
          className="w-full shadow-sm"
          size="lg"
        >
          Sign In
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white/80 dark:bg-[#0f1714]/80 px-2 text-[10px] uppercase tracking-wider text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            type="button"
            variant="subtle"
            className="w-full"
            onClick={() => {
              // trigger Google OAuth flow
            }}
          >
            <span className="flex items-center gap-2">
              <img
                alt=""
                src="https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png"
                className="h-4 w-4"
              />
              Google
            </span>
          </Button>
        </div>

        <p className="text-center text-xs text-gray-600 dark:text-gray-400">
          New here?{' '}
          <Link
            to="/signup"
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}