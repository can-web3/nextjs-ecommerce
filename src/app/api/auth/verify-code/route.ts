// src/app/api/auth/verify-code/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCodeForEmail } from "@/app/api/auth/send-code/route";

export async function POST(req: NextRequest) {
  const { email, code } = (await req.json()) as { email?: string; code?: string };
  if (!email || !code) {
    return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
  }
  const real = getCodeForEmail(email);
  if (real !== code) {
    return NextResponse.json({ error: "Kod yanlış veya süresi dolmuş" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
