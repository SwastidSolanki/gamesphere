import { getSteamProfile, getSteamOwnedGames, resolveSteamVanityURL, getSteamFriends } from "./steam";

export async function fetchUnifiedData(steamIdentifier: string, unusedRiotName: string = "", unusedRiotTag: string = "") {
  let steamId = steamIdentifier;
  
  // Resolve vanity URL if it's not a numeric ID
  if (!/^\d+$/.test(steamIdentifier)) {
    steamId = await resolveSteamVanityURL(steamIdentifier);
  }

  const [steamProfile, steamGames] = await Promise.all([
    getSteamProfile(steamId),
    getSteamOwnedGames(steamId)
  ]);

  return {
    steam: {
      profile: steamProfile || {},
      library: steamGames?.games || [],
      totalPlaytime: (steamGames?.games || []).reduce((acc: number, g: any) => acc + g.playtime_forever, 0) / 60
    }
  };
}

export async function fetchLeaderboardData(platform: "steam", identifier: string) {
  const players = await getSteamFriends(identifier);
  return players.map((p: any, i: number) => ({
    rank: i + 1,
    name: p.personaname,
    score: Math.floor(Math.random() * 5000) + 4000,
    tier: "Elite",
    trend: i % 3 === 0 ? "up" : i % 3 === 1 ? "down" : "stable",
    platform: "Steam",
    avatar: p.avatarfull,
    status: p.personastate === 1 ? "Online" : "Offline"
  }));
}
