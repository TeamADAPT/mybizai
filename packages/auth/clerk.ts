import { currentUser } from "@clerk/nextjs/server";

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
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return undefined;
    }

    const email =
      clerkUser.primaryEmailAddress?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress ??
      null;

    const adminEmails = env.ADMIN_EMAIL
      ? env.ADMIN_EMAIL.split(",").map((value) => value.trim())
      : [];

    return {
      id: clerkUser.id,
      name:
        clerkUser.fullName ??
        clerkUser.firstName ??
        clerkUser.username ??
        email,
      email,
      image: clerkUser.imageUrl ?? null,
      isAdmin: email ? adminEmails.includes(email) : false,
    };
  } catch {
    return undefined;
  }
}
