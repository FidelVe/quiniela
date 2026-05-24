import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  makeToken,
  verifyToken,
} from "./auth-token";

export { SESSION_COOKIE_NAME, verifyToken };

export function credentialsValid(user: string, pass: string): boolean {
  const expectedUser = process.env.MANAGER_USER ?? "admin";
  const expectedPass = process.env.MANAGER_PASSWORD ?? "changeme";
  const userOk = user === expectedUser;
  const a = Buffer.from(pass);
  const b = Buffer.from(expectedPass);
  const passOk = a.length === b.length && timingSafeEqual(a, b);
  return userOk && passOk;
}

export async function setSessionCookie(user: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, makeToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

export async function currentSession(): Promise<{ user: string } | null> {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE_NAME)?.value);
}
