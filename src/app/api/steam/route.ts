import { NextResponse } from "next/server";

const STEAM_API_BASE = "https://api.steampowered.com";
const API_KEY = process.env.STEAM_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");
  const steamid = searchParams.get("steamid");
  const vanityurl = searchParams.get("vanityurl");

  let url = "";

  if (endpoint === "profile") {
    url = `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${steamid}`;
  } else if (endpoint === "owned-games") {
    url = `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${steamid}&format=json&include_appinfo=true`;
  } else if (endpoint === "vanity") {
    url = `${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v0001/?key=${API_KEY}&vanityurl=${vanityurl}`;
  } else {
    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from Steam" }, { status: 500 });
  }
}
