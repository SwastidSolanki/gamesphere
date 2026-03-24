import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const RIOT_CLIENT_ID = process.env.RIOT_CLIENT_ID;
  const RIOT_CLIENT_SECRET = process.env.RIOT_CLIENT_SECRET;
  const REDIRECT_URI = `${baseUrl}/api/auth/riot/callback`;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/dashboard?riot_error=CODE_MISSING`);
  }

  try {
    // Exchange Code for Token
    const tokenResponse = await fetch('https://auth.riotgames.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: RIOT_CLIENT_ID || "",
        client_secret: RIOT_CLIENT_SECRET || "",
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
        throw new Error(tokens.error || "TOKEN_EXCHANGE_FAILED");
    }

    // Get Account Info (Americas region is standard for global accounts)
    const userResponse = await fetch('https://americas.api.riotgames.com/riot/account/v1/accounts/me', {
      headers: { 'Authorization': `Bearer ${tokens.access_token}` },
    });

    const account = await userResponse.json();

    // Redirect to Dashboard with verified Riot identity
    const dashboardUrl = new URL(`${baseUrl}/dashboard`);
    dashboardUrl.searchParams.set('riot_auth', 'success');
    dashboardUrl.searchParams.set('riot_name', account.gameName);
    dashboardUrl.searchParams.set('riot_tag', account.tagLine);
    dashboardUrl.searchParams.set('riot_puuid', account.puuid);
    
    return NextResponse.redirect(dashboardUrl.toString());

  } catch (error: any) {
    console.error("RIOT_AUTH_ERROR:", error);
    
    // In production, you'd show an error. For preview, we'll redirect with a mock if requested or just error.
    return NextResponse.redirect(`${baseUrl}/dashboard?riot_error=${encodeURIComponent(error.message)}`);
  }
}
