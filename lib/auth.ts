import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";

function getAdminToken() {
  return process.env.ADMIN_TOKEN ?? "";
}

export function validateAdminPassword(password: string) {
  const token = getAdminToken();
  return Boolean(token) && password === token;
}

export async function setAdminSession() {
  const token = getAdminToken();
  if (!token) {
    return;
  }
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
}

export async function isAdminLoggedIn() {
  return cookies().get(COOKIE_NAME)?.value === getAdminToken();
}

export async function requireAdmin() {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    redirect("/admin/login");
  }
}
