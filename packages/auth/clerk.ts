import { auth } from "@clerk/nextjs/server";

import { env } from "./env.mjs";

function hasValidClerkSecret(
  secret = process.env.CLERK_SECRET_KEY ?? "",
): boolean {
  if (!secret.startsWith("sk_")) return false;
  if (/^sk_(test|live)_x+$/i.test(secret)) return false;
  if (secret.includes("xxxxxxxx")) return false;
  if (secret.length < 20) return false;
  return true;
}

export async function getSessionUser() {
  // Cloud Preview / placeholder secrets: skip Clerk so public pages still render.
  if (!hasValidClerkSecret()) {
    return undefined;
  }

  try {
    const { sessionClaims } = await auth();
    if (env.ADMIN_EMAIL) {
      const adminEmails = env.ADMIN_EMAIL.split(",");
      if (sessionClaims?.user?.email) {
        sessionClaims.user.isAdmin = adminEmails.includes(
          sessionClaims?.user?.email,
        );
      }
    }
    return sessionClaims?.user;
  } catch {
    return undefined;
  }
}
