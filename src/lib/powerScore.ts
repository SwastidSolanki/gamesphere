export interface PlayerStats {
  steamHours: number;
  steamAchievements: number;
}

export function calculatePowerScore(stats: PlayerStats): number {
  let score = 0;

  // Steam contribution
  score += Math.min(stats.steamHours * 0.5, 5000);
  score += stats.steamAchievements * 50;

  return Math.round(score);
}

export function getRankTier(score: number): string {
  if (score > 9000) return "Legend";
  if (score > 7500) return "Elite";
  if (score > 5000) return "Pro";
  if (score > 2500) return "Competitive";
  return "Recruit";
}
