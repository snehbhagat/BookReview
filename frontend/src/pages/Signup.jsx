import { signup } from '@/api/auth';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import PasswordStrengthBar from '@/components/ui/PasswordStrengthBar';
import TextInput from '@/components/ui/TextInput';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/layouts/AuthLayout';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
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
    const fieldErrors = {};
    if (!form.name || form.name.trim().length < 2) fieldErrors.name = 'Name required';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) fieldErrors.email = 'Valid email required';
    if (!form.password) fieldErrors.password = 'Password required';
    else {
      if (form.password.length < 8) fieldErrors.password = 'Min 8 chars';
      if (!/[A-Z]/.test(form.password)) fieldErrors.password = (fieldErrors.password ? fieldErrors.password + '; ' : '') + 'Needs uppercase';
      if (!/[a-z]/.test(form.password)) fieldErrors.password = (fieldErrors.password ? fieldErrors.password + '; ' : '') + 'Needs lowercase';
      if (!/[0-9]/.test(form.password)) fieldErrors.password = (fieldErrors.password ? fieldErrors.password + '; ' : '') + 'Needs number';
    }
    if (form.password !== form.confirm) fieldErrors.confirm = 'Passwords do not match';
    if (!form.agree) fieldErrors.agree = 'You must accept terms';
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      };
      const { user, token } = await signup(payload);
      saveAuth(user, token);
      navigate('/', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      // If backend returned issues array, show first issue message to user
      let message = data?.error || 'Registration failed';
      if (data?.issues && Array.isArray(data.issues) && data.issues.length > 0) {
        message = data.issues.map(i => i.message).join('; ');
      }
      setErrors({ form: message });
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[SIGNUP][CLIENT][ERROR]', err.response?.data || err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join the community—track discoveries, reviews, and lists."
    >
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        {errors.form && (
          <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500 dark:bg-red-900/30 dark:text-red-300">
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
          hint="Min 8 chars incl Upper, lower, number"
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
                  className="h-4 w-4"
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
          <label className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={e => update('agree', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
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
            <p className="text-[11px] font-medium text-red-600 dark:text-red-400">
              {errors.agree}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" loading={submitting} className="w-full">
          Create Account
        </Button>

        <p className="text-center text-xs text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
