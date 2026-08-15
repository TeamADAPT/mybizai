import { NextResponse } from "next/server";

import { getProviderStatus } from "~/lib/providers";

export const runtime = "nodejs";

/** Public snapshot of which assist/voice providers are active. */
export async function GET() {
  return NextResponse.json(getProviderStatus());
}
