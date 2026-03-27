import { getSteamProfile, getSteamOwnedGames, resolveSteamVanityURL, getSteamFriends, getSteamLevel, getSteamTheme, getSteamBans } from "./steam";

export async function fetchUnifiedData(steamIdentifier: string, unusedRiotName: string = "", unusedRiotTag: string = "") {
  let steamId = steamIdentifier;
  
  // Resolve vanity URL if it's not a numeric ID
  if (!/^\d+$/.test(steamIdentifier)) {
    steamId = await resolveSteamVanityURL(steamIdentifier);
  }

  const [steamProfile, steamGames, steamLevel, steamTheme, steamBans] = await Promise.all([
    getSteamProfile(steamId),
    getSteamOwnedGames(steamId),
    getSteamLevel(steamId),
    getSteamTheme(steamId),
    getSteamBans(steamId)
  ]);

  const allGames = steamGames?.games || [];
  // Fetch achievements for top 5 games to get a better total count
  const top5Games = [...allGames].sort((a: any, b: any) => b.playtime_forever - a.playtime_forever).slice(0, 5);
  let achievements = 0;
  
  const achievResults = await Promise.all(top5Games.map(async (g: any) => {
    try {
      const r = await fetch(`/api/steam?endpoint=achievements&steamid=${steamId}&appid=${g.appid}`);
      const d = await r.json();
      return d?.playerstats?.achievements?.filter((a: any) => a.achieved === 1).length || 0;
    } catch { return 0; }
  }));
  achievements = achievResults.reduce((a, b) => a + b, 0);

  return {
    steam: {
      profile: steamProfile || {},
      library: allGames,
      totalPlaytime: allGames.reduce((acc: number, g: any) => acc + g.playtime_forever, 0) / 60,
      level: steamLevel,
      theme: steamTheme,
      bans: steamBans,
      achievements,
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
  
  // Find top 5 games for better achievement count
  const selfTop5 = (selfGames?.games || []).sort((a: any, b: any) => b.playtime_forever - a.playtime_forever).slice(0, 5);
  let selfAchievements = 0;
  const selfAchievResults = await Promise.all(selfTop5.map(async (g: any) => {
    try {
      const r = await fetch(`/api/steam?endpoint=achievements&steamid=${selfId}&appid=${g.appid}`);
      const d = await r.json();
      return d?.playerstats?.achievements?.filter((a: any) => a.achieved === 1).length || 0;
    } catch { return 0; }
  }));
  selfAchievements = selfAchievResults.reduce((a, b) => a + b, 0);

  const selfEntry = {
    steamid: selfId,
    name: selfProfile?.personaname || "You",
    avatar: selfProfile?.avatarfull || "",
    status: selfProfile?.personastate === 1 ? "Online" : "Offline",
    hours: selfHours,
    games: (selfGames?.games || []).length,
    level: selfLevel,
    achievements: selfAchievements,
    score: Math.round(selfHours * 0.5 + selfLevel * 2 + (selfGames?.games || []).length * 0.2 + selfAchievements * 1.5),
    isSelf: true,
  };

  // Limit friends to first 19 (+ self = 20)
  const friends = (rawFriends || []).slice(0, 19);

  // For each friend, we only have profile (from getSteamFriends which already called summaries).
  // Fetch owned games + level for each in parallel batches
  const friendEntries = await Promise.all(
    friends.map(async (p: any) => {
      try {
        // Try to fetch games, level, and achievements, but don't fail the whole user if one fails
        const [gamesRes, levelRes, achievRes] = await Promise.allSettled([
          getSteamOwnedGames(p.steamid),
          getSteamLevel(p.steamid),
          fetch(`/api/steam?endpoint=achievements&steamid=${p.steamid}&appid=730`).then(r => r.json()) // CS2 as a common metric or total? Steam doesn't do "total achievements" easily.
        ]);

        const gamesData = gamesRes.status === "fulfilled" ? gamesRes.value : null;
        const level = levelRes.status === "fulfilled" ? levelRes.value : 0;
        
        // Find top 3 games for friends (fewer for performance)
        const top3Games = (gamesData?.games || []).sort((a: any, b: any) => b.playtime_forever - a.playtime_forever).slice(0, 3);
        let achievements = 0;
        const friendAchievResults = await Promise.all(top3Games.map(async (g: any) => {
          try {
            const r = await fetch(`/api/steam?endpoint=achievements&steamid=${p.steamid}&appid=${g.appid}`);
            const d = await r.json();
            return d?.playerstats?.achievements?.filter((a: any) => a.achieved === 1).length || 0;
          } catch { return 0; }
        }));
        achievements = friendAchievResults.reduce((a, b) => a + b, 0);

        const hours = gamesData?.games 
          ? Math.round((gamesData.games.reduce((a: number, g: any) => a + g.playtime_forever, 0)) / 60)
          : 0;
        
        const gamesCount = gamesData?.games ? gamesData.games.length : 0;

        return {
          steamid: p.steamid,
          name: p.personaname || "Unknown",
          avatar: p.avatarfull || "",
          status: p.personastate === 1 ? "Online" : "Offline",
          hours,
          games: gamesCount,
          level,
          achievements,
          score: Math.round(hours * 0.5 + level * 2 + gamesCount * 0.2 + achievements * 1.5),
          isSelf: false,
        };
      } catch (err) {
        console.error(`Error fetching friend ${p.steamid}:`, err);
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

export async function fetchVerifiedElites(selfId: string) {
  // Step 1: Get user's direct friends
  let directFriendIds: string[] = [];
  try {
    const res = await fetch(`/api/steam?endpoint=friends&steamid=${selfId}`);
    const data = await res.json();
    directFriendIds = (data?.friendslist?.friends || [])
      .map((f: any) => f.steamid)
      .slice(0, 20); // cap to 20 direct friends for performance
  } catch {}

  // Step 2: For each direct friend, get their friends (friends-of-friends)
  const fofIdSets = await Promise.allSettled(
    directFriendIds.map(async (fid) => {
      try {
        const res = await fetch(`/api/steam?endpoint=friends&steamid=${fid}`);
        const data = await res.json();
        return (data?.friendslist?.friends || [])
          .map((f: any) => f.steamid)
          .slice(0, 10) as string[];
      } catch {
        return [] as string[];
      }
    })
  );

  // Step 3: Build a unique pool of all IDs (friends + friends-of-friends)
  const seenIds = new Set<string>([selfId, ...directFriendIds]);
  const extendedPool: string[] = [];
  for (const result of fofIdSets) {
    if (result.status === "fulfilled") {
      for (const id of result.value) {
        if (!seenIds.has(id)) {
          seenIds.add(id);
          extendedPool.push(id);
          if (extendedPool.length >= 60) break; // cap extended pool
        }
      }
    }
    if (extendedPool.length >= 60) break;
  }

  // Total candidates: direct friends + extended pool (max ~80 total)
  const allCandidateIds = [...directFriendIds, ...extendedPool].slice(0, 80);

  if (allCandidateIds.length === 0) return [];

  // Step 4: Fetch summaries in batches of 100
  const batches: string[][] = [];
  for (let i = 0; i < allCandidateIds.length; i += 100) {
    batches.push(allCandidateIds.slice(i, i + 100));
  }
  const allProfiles: any[] = [];
  for (const batch of batches) {
    try {
      const res = await fetch(`/api/steam?endpoint=summaries&steamids=${batch.join(",")}`);
      const data = await res.json();
      allProfiles.push(...(data?.response?.players || []));
    } catch {}
  }

  // Step 5: Fetch games + levels for each candidate in parallel
  const entries = await Promise.all(
    allProfiles.map(async (p: any) => {
      try {
        const [gamesRes, levelRes] = await Promise.allSettled([
          fetch(`/api/steam?endpoint=owned-games&steamid=${p.steamid}`).then(r => r.json()),
          fetch(`/api/steam?endpoint=level&steamid=${p.steamid}`).then(r => r.json())
        ]);

        const gamesData = gamesRes.status === "fulfilled" ? gamesRes.value?.response : null;
        const level = levelRes.status === "fulfilled"
          ? (levelRes.value?.response?.player_level ?? 0)
          : 0;

        const games = gamesData?.games || [];
        const hours = Math.round(games.reduce((a: number, g: any) => a + (g.playtime_forever || 0), 0) / 60);
        const gamesCount = games.length;

        // Skip private profiles
        if (hours === 0 && gamesCount === 0) return null;

        // Fetch achievements for top 3 games (cap for performance in discovery)
        let achievements = 0;
        const top3Games = [...games].sort((a: any, b: any) => b.playtime_forever - a.playtime_forever).slice(0, 3);
        const eliteAchievResults = await Promise.all(top3Games.map(async (g: any) => {
          try {
            const r = await fetch(`/api/steam?endpoint=achievements&steamid=${p.steamid}&appid=${g.appid}`);
            const d = await r.json();
            return d?.playerstats?.achievements?.filter((a: any) => a.achieved === 1).length || 0;
          } catch { return 0; }
        }));
        achievements = eliteAchievResults.reduce((a, b) => a + b, 0);

        return {
          steamid: p.steamid,
          name: p.personaname || "Unknown",
          avatar: p.avatarfull || "",
          status: p.personastate === 1 ? "Online" : "Offline",
          hours,
          games: gamesCount,
          level,
          achievements,
          score: Math.round(hours * 0.5 + level * 2 + gamesCount * 0.2 + achievements * 1.5),
          isSelf: false,
        };
      } catch {
        return null;
      }
    })
  );

  // Filter nulls (private profiles)
  return entries.filter(Boolean) as any[];
}
