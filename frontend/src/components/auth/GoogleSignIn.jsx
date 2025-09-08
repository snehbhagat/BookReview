import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const GIS_SRC = "https://accounts.google.com/gsi/client";

function useDark() {
  // Detects `.dark` class on <html> for theme-aware button
  const get = useCallback(() => document.documentElement.classList.contains("dark"), []);
  const [isDark, setIsDark] = useState(get);

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(get()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [get]);

  return isDark;
}

function useGoogleScript() {
  const [ready, setReady] = useState(!!window.google?.accounts?.id);

  useEffect(() => {
    if (window.google?.accounts?.id) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => setReady(true);
    script.onerror = () => setReady(false);
    document.head.appendChild(script);
  }, []);

  return ready;
}

/**
 * Props:
 * - onSuccess: (credential: string) => void   // Google ID token (JWT)
 * - onError?: (err: Error) => void
 * - oneTap?: boolean                           // default true
 * - buttonConfig?: GoogleButtonOptions         // size, text, shape, theme
 * - className?: string
 */
export default function GoogleSignIn({
  onSuccess,
  onError,
  oneTap = true,
  buttonConfig,
  className,
}) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const containerRef = useRef(null);
  const isDark = useDark();
  const ready = useGoogleScript();

  const config = useMemo(
    () => ({
      theme: isDark ? "filled_black" : "outline",
      size: "large",
      text: "continue_with",
      shape: "pill",
      logo_alignment: "left",
      ...buttonConfig,
    }),
    [isDark, buttonConfig]
  );

  useEffect(() => {
    if (!ready || !clientId || !containerRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          const cred = response?.credential;
          if (!cred) {
            onError?.(new Error("No credential in Google response"));
            return;
          }
          onSuccess(cred);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: "popup",
      });

      // Render button
      containerRef.current.innerHTML = ""; // avoid duplicates on theme change
      window.google.accounts.id.renderButton(containerRef.current, config);

      // One Tap
      if (oneTap) {
        window.google.accounts.id.prompt(() => {});
      }
    } catch (err) {
      onError?.(err);
    }

    return () => {
      try {
        window.google.accounts.id.cancel();
      } catch {}
    };
  }, [ready, clientId, config, oneTap, onSuccess, onError]);

  return (
    <div className={className}>
      <div ref={containerRef} className="inline-flex" aria-label="Sign in with Google" />
      {!clientId && (
        <p className="mt-2 text-xs text-red-600">
          Missing VITE_GOOGLE_CLIENT_ID in environment.
        </p>
      )}
    </div>
  );
}