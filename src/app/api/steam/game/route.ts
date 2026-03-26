import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appid = searchParams.get("appid");
  const steamid = searchParams.get("steamid");
  const API_KEY = process.env.STEAM_API_KEY;
  
  if (!appid) return NextResponse.json({ error: "Missing appid" }, { status: 400 });

  try {
    // Basic store details (doesn't need API Key)
    const storeResponse = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`);
    const storeData = await storeResponse.json();
    const details = storeData[appid]?.success ? storeData[appid].data : null;

    // Current players
    const currentPlayersRes = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`);
    const currentPlayersData = await currentPlayersRes.json();
    
    // User Stats (Requires API key and steamid)
    let userStats = null;
    let userAchievements = null;
    
    if (steamid && API_KEY) {
        // Try getting both stats and achievements
        try {
            const statsRes = await fetch(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${appid}&key=${API_KEY}&steamid=${steamid}`);
            if (statsRes.ok) {
                const data = await statsRes.json();
                userStats = data.playerstats?.stats || null;
                userAchievements = data.playerstats?.achievements || null;
            }
        } catch(e) {
            console.error("Steam game stats error:", e);
        }
    }

    return NextResponse.json({
        success: true,
        details,
        currentPlayers: currentPlayersData?.response?.player_count || 0,
        userStats,
        userAchievements
    });
  } catch(error) {
    return NextResponse.json({ success: false, error: "Failed to fetch game details" }, { status: 500 });
  }
}
