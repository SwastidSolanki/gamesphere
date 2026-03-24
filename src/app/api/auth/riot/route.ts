import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const RIOT_CLIENT_ID = process.env.RIOT_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const REDIRECT_URI = `${baseUrl}/api/auth/riot/callback`;
  
  if (!RIOT_CLIENT_ID) {
    return NextResponse.redirect(`${baseUrl}/dashboard?riot_error=CREDENTIALS_MISSING`);
  }

  const riotAuthUrl = `https://auth.riotgames.com/authorize?client_id=${RIOT_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=openid+offline_access`;
  
  return NextResponse.redirect(riotAuthUrl);
}
