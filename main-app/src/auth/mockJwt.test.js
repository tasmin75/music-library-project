import { describe, it, expect } from "vitest";
import { issueMockToken, decodeMockToken } from "./mockJwt";

describe("issueMockToken / decodeMockToken", () => {
  it("issues a token with three dot-separated segments", () => {
    const token = issueMockToken({ username: "admin", role: "admin" });
    expect(token.split(".")).toHaveLength(3);
  });

  it("decodes back to the username and role it was issued with", () => {
    const token = issueMockToken({ username: "listener", role: "user" });
    const decoded = decodeMockToken(token);
    expect(decoded.sub).toBe("listener");
    expect(decoded.role).toBe("user");
  });

  it("sets an expiry in the future", () => {
    const token = issueMockToken({ username: "admin", role: "admin" });
    const decoded = decodeMockToken(token);
    expect(decoded.exp).toBeGreaterThan(Date.now());
  });

  it("returns null for an expired token", () => {
    // Hand-build a token with an expiry in the past, the same shape
    // issueMockToken would produce.
    const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(
      JSON.stringify({ sub: "admin", role: "admin", iat: 0, exp: 1 })
    ).toString("base64url");
    const expiredToken = `${header}.${payload}.mock`;

    expect(decodeMockToken(expiredToken)).toBeNull();
  });

  it("returns null for a malformed token instead of throwing", () => {
    expect(decodeMockToken("not-a-real-token")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(decodeMockToken("")).toBeNull();
  });
});
