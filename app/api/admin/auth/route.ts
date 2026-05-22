import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const password = body.password ?? "";
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken || password !== adminToken) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_session", adminToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 86400 * 7,
    path: "/"
  });

  return res;
}
