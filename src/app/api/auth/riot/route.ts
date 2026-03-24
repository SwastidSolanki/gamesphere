import { NextResponse } from 'next/server';

export async function GET() {
  const RIOT_CLIENT_ID = process.env.RIOT_CLIENT_ID;
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/riot/callback`;
  
  if (!RIOT_CLIENT_ID) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?riot_error=CREDENTIALS_MISSING`);
  }

  const riotAuthUrl = `https://auth.riotgames.com/authorize?client_id=${RIOT_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=openid+offline_access`;
  
  return NextResponse.redirect(riotAuthUrl);
}
