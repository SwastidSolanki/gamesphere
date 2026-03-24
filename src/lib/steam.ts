const STEAM_API_BASE = "https://api.steampowered.com";
const API_KEY = process.env.STEAM_API_KEY;

export async function getSteamProfile(steamId: string) {
  const url = `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${steamId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.response.players[0];
}

export async function getSteamOwnedGames(steamId: string) {
  const url = `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${steamId}&format=json&include_appinfo=true`;
  const response = await fetch(url);
  const data = await response.json();
  return data.response;
}

export async function getSteamStats(steamId: string, appId: number) {
  const url = `${STEAM_API_BASE}/ISteamUserStats/GetUserStatsForGame/v0002/?key=${API_KEY}&steamid=${steamId}&appid=${appId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.playerstats;
}
export async function resolveSteamVanityURL(vanityUrl: string) {
  const url = `${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v0001/?key=${API_KEY}&vanityurl=${vanityUrl}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.response.steamid;
}
