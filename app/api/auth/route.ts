import { NextResponse } from "next/server";

const PASSWORD = "Thai2026!";
const COOKIE_NAME = "thai_auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (password === PASSWORD) {
      const res = NextResponse.json({ ok: true });
      const expires = new Date("2026-10-16T23:59:59Z");
      res.cookies.set(COOKIE_NAME, PASSWORD, {
        expires,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res;
    }
    return NextResponse.json({ ok: false, error: "סיסמה שגויה" }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("thai_auth", "", { expires: new Date(0), path: "/" });
  return res;
}
