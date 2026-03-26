const STEAM_API_BASE = "https://api.steampowered.com";
const API_KEY = process.env.STEAM_API_KEY;

export async function getSteamProfile(steamId: string) {
  const response = await fetch(`/api/steam?endpoint=profile&steamid=${steamId}`);
  const data = await response.json();
  return data.response.players[0];
}

export async function getSteamLevel(steamId: string): Promise<number> {
  try {
    const response = await fetch(`/api/steam?endpoint=level&steamid=${steamId}`);
    const data = await response.json();
    return data.response?.player_level ?? 0;
  } catch {
    return 0;
  }
}

export async function getSteamBadges(steamId: string) {
  try {
    const response = await fetch(`/api/steam?endpoint=badges&steamid=${steamId}`);
    const data = await response.json();
    return data.response || null;
  } catch {
    return null;
  }
}

export async function getSteamOwnedGames(steamId: string) {
  const response = await fetch(`/api/steam?endpoint=owned-games&steamid=${steamId}`);
  const data = await response.json();
  return data.response;
}

export async function getSteamStats(steamId: string, appId: number) {
  const url = `${STEAM_API_BASE}/ISteamUserStats/GetUserStatsForGame/v0002/?key=${API_KEY}&steamid=${steamId}&appid=${appId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.playerstats;
}
export async function getSteamFriends(steamId: string) {
  const response = await fetch(`/api/steam?endpoint=friends&steamid=${steamId}`);
  const data = await response.json();
  
  // GetFriendList does NOT have a .response wrapper
  const friendslist = data.friendslist;
  
  if (!friendslist) {
    console.warn("STEAM_FRIENDS_RESTRICTED: PROFILE MAY BE PRIVATE");
    return [];
  }
  
  const friends = friendslist.friends;
  if (!friends || friends.length === 0) return [];
  
  // Limit to top 25 friends to avoid URL length issues and stay within summary limits
  const limitedFriends = friends.slice(0, 25);
  const friendIds = limitedFriends.map((f: any) => f.steamid).join(",");
  const summariesResponse = await fetch(`/api/steam?endpoint=summaries&steamids=${friendIds}`);
  const summariesData = await summariesResponse.json();
  return summariesData.response?.players || [];
}

export async function resolveSteamVanityURL(vanityUrl: string) {
  const response = await fetch(`/api/steam?endpoint=vanity&vanityurl=${vanityUrl}`);
  const data = await response.json();
  return data.response.steamid;
}

export async function getSteamTheme(steamId: string) {
  try {
    const response = await fetch(`/api/steam?endpoint=theme&steamid=${steamId}`);
    const html = await response.text();

    // Extract Avatar Frame
    const frameRegex = /<div class="profile_header_avatar_frame">[\s\S]*?<img src="(.*?)"/;
    const frameMatch = html.match(frameRegex);
    const frame = frameMatch ? frameMatch[1] : null;

    // Extract Background
    const backgroundRegex = /<div class="profile_background_image_details" style="background-image: url\((.*?)\)">/;
    const backgroundMatch = html.match(backgroundRegex);
    const background = backgroundMatch ? backgroundMatch[1] : null;

    // Extract Theme Class
    const themeClassRegex = /<body class="v6 (.*?) "[\s\S]*?>/;
    const themeClassMatch = html.match(themeClassRegex);
    const themeClass = themeClassMatch ? themeClassMatch[1] : "";

    return { background, frame, themeClass };
  } catch {
    return { background: null, frame: null, themeClass: "" };
  }
}

export async function getSteamBans(steamId: string) {
  try {
    const response = await fetch(`/api/steam?endpoint=bans&steamid=${steamId}`);
    const data = await response.json();
    return data.players[0] || null;
  } catch {
    return null;
  }
}
