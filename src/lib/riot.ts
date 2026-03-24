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
  const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}&api_key=${RIOT_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function getMatchDetails(matchId: string, region: string = "americas") {
  const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
