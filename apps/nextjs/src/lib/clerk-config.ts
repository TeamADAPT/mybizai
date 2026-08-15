/**
 * Shared Clerk key checks — safe for server components / layout.
 * Keep in sync with middleware `hasValidClerkSecret` rules.
 */

export function hasValidClerkSecret(
  secret = process.env.CLERK_SECRET_KEY ?? "",
): boolean {
  if (!secret.startsWith("sk_")) return false;
  if (/^sk_(test|live)_x+$/i.test(secret)) return false;
  if (secret.includes("xxxxxxxx")) return false;
  if (secret.length < 20) return false;
  return true;
}

export function hasValidClerkPublishableKey(
  key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
): boolean {
  if (!key.startsWith("pk_")) return false;
  if (/^pk_(test|live)_x+$/i.test(key)) return false;
  if (key.includes("xxxxxxxx")) return false;
  if (key.length < 20) return false;
  return true;
}

export function hasClerkConfigured(): boolean {
  return hasValidClerkSecret() && hasValidClerkPublishableKey();
}
