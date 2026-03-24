import { getSteamProfile, getSteamOwnedGames, resolveSteamVanityURL } from "./steam";
import { getRiotAccountByRiotId, getSummonerByPuuid, getLeagueBySummonerId } from "./riot";

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
      profile: steamProfile,
      library: steamGames.games || [],
      totalPlaytime: (steamGames.games || []).reduce((acc: number, g: any) => acc + g.playtime_forever, 0) / 60
    },
    riot: {
      account: riotAccount,
      summoner,
      league: league[0] || null
    }
  };
}
