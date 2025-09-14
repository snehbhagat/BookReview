import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import Button from '@/components/ui/Button';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password required")
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function validate() {
    try {
      loginSchema.parse(form);
      setErrors({});
      return true;
    } catch (e) {
      const fieldErrors = {};
      if (e.errors) for (const err of e.errors) fieldErrors[err.path[0]] = err.message;
      setErrors(fieldErrors);
      return false;
    }
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

  async function onGoogle() {
    setGoogleLoading(true);
    window.location.href = '/api/auth/google'; // Redirect to backend endpoint
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

        <div className="grid grid-cols-1 gap-3">
          <Button
            type="button"
            variant="subtle"
            className="w-full"
            loading={googleLoading}
            onClick={onGoogle}
          >
            <span className="flex items-center gap-3 justify-center">
              <img
                alt=""
                src="https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png"
                className="h-6 w-6"
              />
              Google
            </span>
          </Button>
        </div>

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