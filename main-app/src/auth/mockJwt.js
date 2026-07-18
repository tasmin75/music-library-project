/**
 * A deliberately minimal, unsigned "JWT-shaped" token — header.payload.signature,
 * base64url encoded, no crypto behind the signature segment. The brief asks for
 * "a simple in-memory JWT approach" that doesn't validate against a real backend,
 * so building an actual signing/verification pipeline here would be solving a
 * problem the assignment isn't asking about. This is enough to demonstrate the
 * shape of token-based auth: issue on login, decode on load, expire on time.
 */

function base64UrlEncode(obj) {
  const json = JSON.stringify(obj);
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(segment) {
  const padLength = (4 - (segment.length % 4)) % 4;
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLength);
  return JSON.parse(atob(padded));
}

const SESSION_LENGTH_MS = 8 * 60 * 60 * 1000; // 8 hours

export function issueMockToken({ username, role }) {
  const header = base64UrlEncode({ alg: "none", typ: "JWT" });
  const payload = base64UrlEncode({
    sub: username,
    role,
    iat: Date.now(),
    exp: Date.now() + SESSION_LENGTH_MS,
  });
  return `${header}.${payload}.mock`;
}

export function decodeMockToken(token) {
  try {
    const [, payloadSegment] = token.split(".");
    const payload = base64UrlDecode(payloadSegment);
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
