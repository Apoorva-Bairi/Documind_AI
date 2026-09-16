import crypto from "crypto";

const DIMENSIONS = 768;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest();
}

export async function createEmbedding(text) {
  const vector = new Array(DIMENSIONS).fill(0);

  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  for (const token of tokens) {
    const hash = hashToken(token);
    const index = hash.readUInt32BE(0) % DIMENSIONS;
    const sign = hash[4] % 2 === 0 ? 1 : -1;

    vector[index] += sign;
  }

  const magnitude = Math.sqrt(
    vector.reduce((sum, value) => sum + value * value, 0)
  );

  if (magnitude === 0) return vector;

  return vector.map((value) => value / magnitude);
}