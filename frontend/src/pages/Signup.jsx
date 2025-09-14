import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import PasswordStrengthBar from '@/components/ui/PasswordStrengthBar';
import Button from '@/components/ui/Button';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm: z.string(),
  agree: z.literal(true, { errorMap: () => ({ message: 'You must accept terms' }) })
}).refine(data => data.password === data.confirm, {
  path: ['confirm'],
  message: "Passwords do not match"
});

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    agree: false
  });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function validate() {
    try {
      signupSchema.parse(form);
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
      // TODO: call real signup API
      await new Promise(r => setTimeout(r, 1000));
      navigate('/login', { replace: true });
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join the community—track discoveries, reviews, and lists."
    >
      <form onSubmit={onSubmit} className="space-y-8">
        {errors.form && (
          <div className="rounded-md border border-red-300 bg-red-50 px-3 py-3 text-base text-red-700 dark:border-red-500 dark:bg-red-900/30 dark:text-red-300">
            {errors.form}
          </div>
        )}

        <FormField label="Full Name" htmlFor="name" error={errors.name} required>
          <TextInput
            id="name"
            placeholder="Jane Doe"
            autoComplete="name"
            value={form.name}
            onChange={e => update('name', e.target.value)}
          />
        </FormField>

        <FormField label="Email" htmlFor="email" error={errors.email} required>
          <TextInput
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password}
          required
          hint="Use at least 8 characters, mixing letters, numbers & symbols."
        >
          <TextInput
            id="password"
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            value={form.password}
            onChange={e => update('password', e.target.value)}
            rightIcon={{
              icon: (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  {showPw ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18M10.5 10.5a3.5 3.5 0 004.95 4.95M9.88 9.88A3.5 3.5 0 0112 8.5c1.932 0 3.5 1.568 3.5 3.5 0 .745-.236 1.435-.636 2.01M6.455 6.455C4.28 7.88 2.67 9.94 2 12c1.5 4.5 6 7.5 10 7.5 1.818 0 3.55-.46 5.045-1.27M17.546 17.546C19.72 16.12 21.33 14.06 22 12c-1.5-4.5-6-7.5-10-7.5-1.03 0-2.03.15-2.985.435"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM2 12c1.5-4.5 6-7.5 10-7.5s8.5 3 10 7.5c-1.5 4.5-6 7.5-10 7.5S3.5 16.5 2 12z"
                    />
                  )}
                </svg>
              ),
              onClick: () => setShowPw(p => !p)
            }}
          />
          <PasswordStrengthBar password={form.password} />
        </FormField>

        <FormField
          label="Confirm Password"
          htmlFor="confirm"
          error={errors.confirm}
          required
        >
          <TextInput
            id="confirm"
            type="password"
            placeholder="Repeat password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={e => update('confirm', e.target.value)}
          />
        </FormField>

        <div className="space-y-2">
          <label className="flex items-start gap-2 text-base text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={e => update('agree', e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
            />
            <span>
              I agree to the{' '}
              <Link to="/terms" className="text-emerald-600 hover:underline dark:text-emerald-400">
                Terms
              </Link>{' '}
              &{' '}
              <Link
                to="/privacy"
                className="text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.agree && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400">
              {errors.agree}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" loading={submitting} className="w-full">
          Create Account
        </Button>

        <p className="text-center text-lg text-gray-600 dark:text-gray-400 pt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}