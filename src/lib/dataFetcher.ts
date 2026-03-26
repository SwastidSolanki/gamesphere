import { getSteamProfile, getSteamOwnedGames, resolveSteamVanityURL, getSteamFriends, getSteamLevel } from "./steam";

export async function fetchUnifiedData(steamIdentifier: string, unusedRiotName: string = "", unusedRiotTag: string = "") {
  let steamId = steamIdentifier;
  
  // Resolve vanity URL if it's not a numeric ID
  if (!/^\d+$/.test(steamIdentifier)) {
    steamId = await resolveSteamVanityURL(steamIdentifier);
  }

  const [steamProfile, steamGames, steamLevel] = await Promise.all([
    getSteamProfile(steamId),
    getSteamOwnedGames(steamId),
    getSteamLevel(steamId)
  ]);

  return {
    steam: {
      profile: steamProfile || {},
      library: steamGames?.games || [],
      totalPlaytime: (steamGames?.games || []).reduce((acc: number, g: any) => acc + g.playtime_forever, 0) / 60,
      level: steamLevel
    }
  };
}

export async function fetchLeaderboardData(platform: "steam", identifier: string) {
  // Resolve the self steamid
  let selfId = identifier;
  if (!/^\d+$/.test(identifier)) {
    selfId = await resolveSteamVanityURL(identifier);
  }

  // Fetch self data + friends list in parallel
  const [selfProfile, selfGames, selfLevel, rawFriends] = await Promise.all([
    getSteamProfile(selfId),
    getSteamOwnedGames(selfId),
    getSteamLevel(selfId),
    getSteamFriends(selfId),
  ]);

  // Build self entry
  const selfHours = Math.round(
    ((selfGames?.games || []).reduce((a: number, g: any) => a + g.playtime_forever, 0)) / 60
  );
  const selfEntry = {
    steamid: selfId,
    name: selfProfile?.personaname || "You",
    avatar: selfProfile?.avatarfull || "",
    status: selfProfile?.personastate === 1 ? "Online" : "Offline",
    hours: selfHours,
    games: (selfGames?.games || []).length,
    level: selfLevel,
    score: Math.round(selfHours * 0.5 + selfLevel * 2 + (selfGames?.games || []).length * 0.2),
    isSelf: true,
  };

  // Limit friends to first 19 (+ self = 20)
  const friends = (rawFriends || []).slice(0, 19);

  // For each friend, we only have profile (from getSteamFriends which already called summaries).
  // Fetch owned games + level for each in parallel batches
  const friendEntries = await Promise.all(
    friends.map(async (p: any) => {
      try {
        const [gamesData, level] = await Promise.all([
          getSteamOwnedGames(p.steamid),
          getSteamLevel(p.steamid),
        ]);
        const hours = Math.round(
          ((gamesData?.games || []).reduce((a: number, g: any) => a + g.playtime_forever, 0)) / 60
        );
        return {
          steamid: p.steamid,
          name: p.personaname || "Unknown",
          avatar: p.avatarfull || "",
          status: p.personastate === 1 ? "Online" : "Offline",
          hours,
          games: (gamesData?.games || []).length,
          level,
          score: Math.round(hours * 0.5 + level * 2 + (gamesData?.games || []).length * 0.2),
          isSelf: false,
        };
      } catch {
        return {
          steamid: p.steamid,
          name: p.personaname || "Unknown",
          avatar: p.avatarfull || "",
          status: "Unknown",
          hours: 0, games: 0, level: 0, score: 0, isSelf: false,
        };
      }
    })
  );

  return [selfEntry, ...friendEntries];
}

