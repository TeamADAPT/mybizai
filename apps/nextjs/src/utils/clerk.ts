import { match as matchLocale } from "@formatjs/intl-localematcher";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";

import { hasValidClerkSecret } from "~/lib/clerk-config";
import { i18n } from "~/config/i18n-config";
import { env } from "@saasfly/auth/env.mjs";

const noNeedProcessRoute = [".*\\.png", ".*\\.jpg", ".*\\.opengraph-image.png"];

const noRedirectRoute = ["/api(.*)", "/trpc(.*)", "/admin"];

export const isPublicRoute = createRouteMatcher([
  new RegExp("/(\\w{2}/)?signin(.*)"),
  new RegExp("/(\\w{2}/)?login(.*)"),
  new RegExp("/(\\w{2}/)?login-clerk(.*)"),
  new RegExp("/(\\w{2}/)?register(.*)"),
  new RegExp("/(\\w{2}/)?terms(.*)"),
  new RegExp("/(\\w{2}/)?privacy(.*)"),
  new RegExp("/(\\w{2}/)?docs(.*)"),
  new RegExp("/(\\w{2}/)?blog(.*)"),
  new RegExp("/(\\w{2}/)?pricing(.*)"),
  new RegExp("/(\\w{2}/)?design(.*)"),
  new RegExp("/(\\w{2}/)?shell(.*)"),
  new RegExp("/(\\w{2}/)?brand-kit(.*)"),
  new RegExp("/(\\w{2}/)?playbook(.*)"),
  new RegExp("/(\\w{2}/)?research(.*)"),
  new RegExp("/(\\w{2}/)?finance(.*)"),
  new RegExp("/(\\w{2}/)?campaigns(.*)"),
  new RegExp("/(\\w{2}/)?plan(.*)"),
  new RegExp("/(\\w{2}/)?marketplace(.*)"),
  new RegExp("/(\\w{2}/)?academy(.*)"),
  new RegExp("/(\\w{2}/)?onboarding(.*)"),
  new RegExp("/(\\w{2}/)?voice(.*)"),
  "/api/assist(.*)",
  "/api/voice(.*)",
  "/api/providers(.*)",
  "/api/coding(.*)",
  new RegExp("^/\\w{2}$"), // root with locale
]);

export { hasValidClerkSecret } from "~/lib/clerk-config";

export function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });
  const locales = Array.from(i18n.locales);
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );
  return matchLocale(languages, locales, i18n.defaultLocale);
}

export function isNoRedirect(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname;
  return noRedirectRoute.some((route) => new RegExp(route).test(pathname));
}

export function isNoNeedProcess(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname;
  return noNeedProcessRoute.some((route) => new RegExp(route).test(pathname));
}

function withLocaleRedirect(req: NextRequest): NextResponse | null {
  if (isNoNeedProcess(req)) {
    return null;
  }

  if (
    req.nextUrl.pathname.startsWith("/api/webhooks/") ||
    req.nextUrl.pathname.startsWith("/api/assist") ||
    req.nextUrl.pathname.startsWith("/api/voice") ||
    req.nextUrl.pathname.startsWith("/api/providers") ||
    req.nextUrl.pathname.startsWith("/api/coding")
  ) {
    return NextResponse.next();
  }

  const pathname = req.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (!isNoRedirect(req) && pathnameIsMissingLocale) {
    const locale = getLocale(req);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        req.url,
      ),
    );
  }

  return null;
}

/** Locale-only middleware used when Clerk keys are missing/placeholder (Cloud Preview). */
async function previewSafeMiddleware(req: NextRequest) {
  const redirected = withLocaleRedirect(req);
  if (redirected) return redirected;
  return NextResponse.next();
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error Clerk callback typing
const clerkAwareMiddleware = clerkMiddleware(async (auth, req: NextRequest) => {
  const redirected = withLocaleRedirect(req);
  if (redirected) return redirected;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error Clerk matcher typing
  if (isPublicRoute(req)) {
    return null;
  }

  const { userId, sessionClaims } = await auth();

  const isAuth = !!userId;
  let isAdmin = false;
  if (env.ADMIN_EMAIL) {
    const adminEmails = env.ADMIN_EMAIL.split(",");
    if (sessionClaims?.user?.email) {
      isAdmin = adminEmails.includes(sessionClaims?.user?.email);
    }
  }

  const isAuthPage = /^\/[a-zA-Z]{2,}\/(login|register|login-clerk)/.test(
    req.nextUrl.pathname,
  );
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/trpc/");
  const locale = getLocale(req);
  if (isAuthRoute && isAuth) {
    return NextResponse.next();
  }
  if (req.nextUrl.pathname.startsWith("/admin/dashboard")) {
    if (!isAuth || !isAdmin)
      return NextResponse.redirect(new URL(`/admin/login`, req.url));
    return NextResponse.next();
  }
  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
    }
    return null;
  }
  if (!isAuth) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(
      new URL(
        `/${locale}/login-clerk?from=${encodeURIComponent(from)}`,
        req.url,
      ),
    );
  }
});

export const middleware = hasValidClerkSecret()
  ? clerkAwareMiddleware
  : previewSafeMiddleware;
