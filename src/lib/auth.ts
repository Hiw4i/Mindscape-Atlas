import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "atlas_session";
const MAX_AGE_S = 60 * 60 * 24 * 14; // 14 дней

function getSecret(): string {
  const password = process.env.ADMIN_PASSWORD ?? "atlas-admin";
  return process.env.SESSION_SECRET ?? `${password}::atlas-fallback-secret`;
}

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

function makeToken(): string {
  const payload = String(Date.now() + MAX_AGE_S * 1000);
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  return Number(payload) > Date.now();
}

function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "atlas-admin";
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Проверка пароля из формы входа. Возвращает true при совпадении. */
export function checkAdminPassword(input: string): boolean {
  if (!process.env.ADMIN_PASSWORD) {
    console.warn(
      "[mindscape-atlas] ADMIN_PASSWORD is not set - the built-in default password is active. Set ADMIN_PASSWORD in .env.local before deploying."
    );
  }
  return input.length > 0 && passwordMatches(input);
}
