const RIOT_API_KEY = process.env.RIOT_API_KEY;

export async function getSummonerByName(summonerName: string, region: string = "na1") {
  const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${RIOT_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function getLeagueBySummonerId(summonerId: string, region: string = "na1") {
  const url = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${RIOT_API_KEY}`;
  const response = await fetch(url);
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
