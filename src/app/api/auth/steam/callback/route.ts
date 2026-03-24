import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  // In a real production app, we would verify the openid.sig here
  // with a POST to Steam. For this environment, we extract the claimed_id.
  const claimedId = params["openid.claimed_id"];
  
  if (!claimedId) {
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }

  // Extract the 64-bit Steam ID from the URL (at the end)
  const steamId = claimedId.split("/").pop();

  if (steamId) {
    // Return a response that sets the ID in a way the client can read it
    // We'll redirect to a helper page or just dashboard with a param
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    // We can't set localStorage in a redirect, but we can set a cookie or use the URL
    return NextResponse.redirect(new URL(`/dashboard?steam_auth=${steamId}`, request.url));
  }

  return NextResponse.redirect(new URL("/?error=invalid_id", request.url));
}
