const RIOT_API_KEY = process.env.RIOT_API_KEY;

export async function getRiotAccountByRiotId(gameName: string, tagLine: string, region: string = "americas") {
  const response = await fetch(`/api/riot?endpoint=account&gameName=${gameName}&tagLine=${tagLine}&region=${region}`);
  const data = await response.json();
  return data;
}

export async function getSummonerByPuuid(puuid: string, region: string = "na1") {
  const response = await fetch(`/api/riot?endpoint=summoner&puuid=${puuid}&region=${region}`);
  const data = await response.json();
  return data;
}

export async function getLeagueBySummonerId(summonerId: string, region: string = "na1") {
  const response = await fetch(`/api/riot?endpoint=league&summonerId=${summonerId}&region=${region}`);
  const data = await response.json();
  return data;
}

export async function getMatchIdsByPuuid(puuid: string, region: string = "americas", count: number = 10) {
  const response = await fetch(`/api/riot?endpoint=match-ids&puuid=${puuid}&region=${region}&count=${count}`);
  const data = await response.json();
  return data;
}

export async function getMatchDetails(matchId: string, region: string = "americas") {
  const response = await fetch(`/api/riot?endpoint=match-details&matchId=${matchId}&region=${region}`);
  const data = await response.json();
  return data;
}

export async function getRecentRivals(puuid: string, region: string = "americas") {
  const matchIds = await getMatchIdsByPuuid(puuid, region, 1);
  if (!matchIds || matchIds.length === 0) return [];
  
  const match = await getMatchDetails(matchIds[0], region);
  if (!match || !match.info) return [];

  return match.info.participants.map((p: any) => ({
    name: `${p.riotIdGameName}#${p.riotIdTagline}`,
    rank: p.championName, // Use champion as a temporary sub-label
    puuid: p.puuid,
    teamId: p.teamId,
    win: p.win
  }));
}
