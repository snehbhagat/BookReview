// Utility to generate a deterministic default avatar URL based on name/email.
// Using Dicebear initials style (no PII beyond initials sent to service).
// If privacy concerns arise, replace with local SVG generator later.

function defaultAvatar(name, email) {
  const base = (name && name.trim()) || (email && email.split('@')[0]) || 'User';
  // Limit seed length to avoid overly long URLs
  const seed = encodeURIComponent(base.slice(0, 40));
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundType=gradientLinear&fontSize=40`;
}

module.exports = { defaultAvatar };
