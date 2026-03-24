export interface PlayerStats {
  steamHours: number;
  steamAchievements: number;
  riotRank: string; // e.g., "Diamond IV"
  riotWinRate: number; // e.g., 0.55
  riotKD: number;
}

const RANK_VALUES: Record<string, number> = {
  "IRON": 1, "BRONZE": 2, "SILVER": 3, "GOLD": 4, "PLATINUM": 5, 
  "EMERALD": 6, "DIAMOND": 7, "MASTER": 8, "GRANDMASTER": 9, "CHALLENGER": 10
};

export function calculatePowerScore(stats: PlayerStats): number {
  let score = 0;

  // Steam contribution (max ~3000)
  score += Math.min(stats.steamHours * 0.5, 2000);
  score += stats.steamAchievements * 10;

  // Riot contribution (max ~7000)
  const [tier] = stats.riotRank.split(" ");
  const tierValue = RANK_VALUES[tier.toUpperCase()] || 0;
  
  score += tierValue * 500;
  score += stats.riotWinRate * 1000;
  score += stats.riotKD * 500;

  return Math.round(score);
}

export function getRankTier(score: number): string {
  if (score > 9000) return "Legend";
  if (score > 7500) return "Elite";
  if (score > 5000) return "Pro";
  if (score > 2500) return "Competitive";
  return "Recruit";
}
