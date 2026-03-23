import crypto from "crypto";

/**
 * Generates an OAuth 1.0a Authorization header for Upwork API calls.
 * Uses 2-legged OAuth (app credentials only, no user access tokens required
 * for public job search endpoints).
 */
export function buildOAuthHeader(
  method: string,
  url: string,
  consumerKey: string,
  consumerSecret: string,
  accessToken?: string,
  accessTokenSecret?: string
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_version: "1.0",
  };

  if (accessToken) {
    oauthParams["oauth_token"] = accessToken;
  }

  // Build the parameter string (all params sorted alphabetically)
  const allParams = { ...oauthParams };
  const paramString = Object.keys(allParams)
    .sort()
    .map(
      (k) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(allParams[k])}`
    )
    .join("&");

  // Build the signature base string
  const signatureBase = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(paramString),
  ].join("&");

  // Build the signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&${
    accessTokenSecret ? encodeURIComponent(accessTokenSecret) : ""
  }`;

  // Generate HMAC-SHA1 signature
  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(signatureBase)
    .digest("base64");

  oauthParams["oauth_signature"] = signature;

  // Build Authorization header
  const headerValue =
    "OAuth " +
    Object.keys(oauthParams)
      .sort()
      .map(
        (k) =>
          `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`
      )
      .join(", ");

  return headerValue;
}
