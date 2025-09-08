import React, { useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import GoogleSignIn from "@/components/auth/GoogleSignIn";

function LoginInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }, [email, password, navigate]);

  // ADD: Google Sign-In handler (non-breaking)
  const onGoogleSuccess = useCallback(
    async (credential) => {
      try {
        setSubmitting(true);
        setError("");
        const { data } = await api.post("/auth/oauth/google", { credential });
        localStorage.setItem("token", data.token);
        navigate("/");
      } catch (err) {
        setError(err?.response?.data?.message || "Google sign-in failed. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [navigate]
  );

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Enter your credentials to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
              {error}
            </div>
          )}

          {/* ADD: Google Sign-In button (keeps your existing form) */}
          <div className="mb-5">
            <GoogleSignIn
              onSuccess={onGoogleSuccess}
              onError={(e) => setError(e?.message || "Google sign-in failed")}
              oneTap={true}
            />
          </div>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* EXISTING email/password form (unchanged) */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-muted-foreground">
                Email
              </label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                  Password
                </label>
                <button type="button" className="text-xs text-primary hover:underline" onClick={() => setShowPw((v) => !v)}>
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              <Input id="password" type={showPw ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <Button className="w-full" disabled={submitting}>{submitting ? "Signing in..." : "Sign In"}</Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Don’t have an account?
          <Link to="/register" className="ml-1 text-primary hover:underline">Sign up</Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default React.memo(LoginInner);