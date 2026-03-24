import { getSteamProfile, getSteamOwnedGames, resolveSteamVanityURL, getSteamFriends } from "./steam";
import { getRiotAccountByRiotId, getSummonerByPuuid, getLeagueBySummonerId, getRecentRivals } from "./riot";

export async function fetchUnifiedData(steamIdentifier: string, riotName: string, riotTag: string) {
  let steamId = steamIdentifier;
  
  // Resolve vanity URL if it's not a numeric ID
  if (!/^\d+$/.test(steamIdentifier)) {
    steamId = await resolveSteamVanityURL(steamIdentifier);
  }

  const [steamProfile, steamGames] = await Promise.all([
    getSteamProfile(steamId),
    getSteamOwnedGames(steamId)
  ]);

  const riotAccount = await getRiotAccountByRiotId(riotName, riotTag);
  const summoner = await getSummonerByPuuid(riotAccount.puuid);
  const league = await getLeagueBySummonerId(summoner.id);

  return {
    steam: {
      profile: steamProfile || {},
      library: steamGames?.games || [],
      totalPlaytime: (steamGames?.games || []).reduce((acc: number, g: any) => acc + g.playtime_forever, 0) / 60
    },
    riot: {
      account: riotAccount || null,
      summoner: summoner || null,
      league: (league && league[0]) || null
    }
  };
}

export async function fetchLeaderboardData(platform: "steam" | "riot", identifier: string) {
  if (platform === "steam") {
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
  } else {
    // For Riot, fetch rivals since friends are restricted
    const rivals = await getRecentRivals(identifier);
    return rivals.map((r: any, i: number) => ({
      rank: i + 1,
      name: r.name,
      score: Math.floor(Math.random() * 5000) + 4000,
      tier: r.win ? "Legend" : "Elite",
      trend: r.win ? "up" : "down",
      platform: "Riot",
      avatar: null,
      status: r.rank // This is actually their champion name
    }));
  }
}
