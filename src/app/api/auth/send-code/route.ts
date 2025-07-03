import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const codes = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };
  if (!email) {
    return NextResponse.json({ error: "E-posta gerekli" }, { status: 400 });
  }

  // 6 haneli rasgele kod
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  // 5 dakika geçerli
  codes.set(email, { code, expiresAt: Date.now() + 5 * 60_000 });

  console.log(`📨 [DEV] Kod for ${email}: ${code}`);

  return NextResponse.json({ ok: true, code });
}

export function getCodeForEmail(email: string) {
  const entry = codes.get(email);
  if (entry && entry.expiresAt > Date.now()) return entry.code;
  return null;
}
