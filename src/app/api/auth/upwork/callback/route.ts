import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/upwork/callback
 *
 * Upwork OAuth 1.0a callback handler scaffold.
 *
 * To register this app with Upwork, use the following callback URL:
 *   http://localhost:3000/api/auth/upwork/callback
 *
 * Required environment variables:
 *   UPWORK_CLIENT_ID      - Your Upwork OAuth app consumer key
 *   UPWORK_CLIENT_SECRET  - Your Upwork OAuth app consumer secret
 *   UPWORK_REDIRECT_URI   - http://localhost:3000/api/auth/upwork/callback
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // OAuth 1.0a: oauth_token and oauth_verifier
  const oauthToken = searchParams.get("oauth_token");
  const oauthVerifier = searchParams.get("oauth_verifier");

  // OAuth 2.0 style: code and state
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  console.log("[JobPing] Upwork OAuth callback received:", {
    oauthToken,
    oauthVerifier,
    code,
    state,
  });

  // TODO: Exchange token/verifier or code for an access token using
  // UPWORK_CLIENT_ID and UPWORK_CLIENT_SECRET from process.env.

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JobPing – Upwork Callback</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0f; color: #e2e8f0; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; }
    .card { background: #111827; border: 1px solid #1f2937; border-radius: 1.25rem; padding: 2.5rem; max-width: 480px; width: 100%; text-align: center; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #a78bfa; margin-bottom: 0.5rem; }
    p { color: #9ca3af; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem; }
    code { display: block; background: #1f2937; border-radius: 0.5rem; padding: 1rem; font-size: 0.8rem; text-align: left; word-break: break-all; color: #6ee7b7; margin: 1rem 0; }
    a { color: #a78bfa; text-decoration: none; font-size: 0.85rem; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>⚡ JobPing</h1>
    <p>Upwork OAuth Callback received!</p>
    <code>${JSON.stringify({ oauthToken, oauthVerifier, code, state }, null, 2)}</code>
    <p>This is a placeholder. Exchange the token for an access token in the route handler.</p>
    <a href="/">← Back to Job Feed</a>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
