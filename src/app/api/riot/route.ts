import { NextResponse } from "next/server";

const RIOT_API_KEY = process.env.RIOT_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");
  const region = searchParams.get("region") || "americas";
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");
  const puuid = searchParams.get("puuid");
  const summonerId = searchParams.get("summonerId");

  let url = "";

  if (endpoint === "account") {
    url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${RIOT_API_KEY}`;
  } else if (endpoint === "summoner") {
    url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`;
  } else if (endpoint === "league") {
    url = `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${RIOT_API_KEY}`;
  } else if (endpoint === "match-ids") {
    const count = searchParams.get("count") || "10";
    url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}&api_key=${RIOT_API_KEY}`;
  } else if (endpoint === "match-details") {
    const matchId = searchParams.get("matchId");
    url = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`;
  } else {
    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from Riot" }, { status: 500 });
  }
}
