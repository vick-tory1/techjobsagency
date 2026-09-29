import argon2 from "argon2";
import { createHash, timingSafeEqual } from "crypto";

function legacyHashWithSalt(password: string, salt: string) {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

function verifyLegacyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const candidate = legacyHashWithSalt(password, salt);
  const candidateBuffer = Buffer.from(candidate, "hex");
  const hashBuffer = Buffer.from(hash, "hex");
  return candidateBuffer.length === hashBuffer.length && timingSafeEqual(candidateBuffer, hashBuffer);
}

export async function hashPassword(password: string) {
  return argon2.hash(password, { type: argon2.argon2id });
}

export function isLegacyPasswordHash(storedHash?: string) {
  return Boolean(storedHash && !storedHash.startsWith("$argon2"));
}

export async function verifyPassword(password: string, storedHash?: string) {
  if (!storedHash) return false;
  if (isLegacyPasswordHash(storedHash)) return verifyLegacyPassword(password, storedHash);
  try {
    return await argon2.verify(storedHash, password);
  } catch {
    return false;
  }
}
