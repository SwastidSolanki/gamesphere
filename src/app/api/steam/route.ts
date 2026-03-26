import { NextResponse } from "next/server";

const STEAM_API_BASE = "https://api.steampowered.com";
const API_KEY = process.env.STEAM_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");
  const steamid = searchParams.get("steamid");
  const vanityurl = searchParams.get("vanityurl");
  const q = searchParams.get("q");

  let url = "";

  if (endpoint === "profile") {
    url = `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${steamid}`;
  } else if (endpoint === "summaries") {
    const steamids = searchParams.get("steamids");
    url = `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${steamids}`;
  } else if (endpoint === "friends") {
    url = `${STEAM_API_BASE}/ISteamUser/GetFriendList/v0001/?key=${API_KEY}&steamid=${steamid}&relationship=friend`;
  } else if (endpoint === "owned-games") {
    // include_played_free_games=1 ensures CS2 and other F2P games show up
    url = `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${steamid}&format=json&include_appinfo=1&include_played_free_games=1`;
  } else if (endpoint === "vanity") {
    url = `${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v0001/?key=${API_KEY}&vanityurl=${vanityurl}`;
  } else if (endpoint === "level") {
    url = `${STEAM_API_BASE}/IPlayerService/GetSteamLevel/v1/?key=${API_KEY}&steamid=${steamid}`;
  } else if (endpoint === "badges") {
    url = `${STEAM_API_BASE}/IPlayerService/GetBadges/v1/?key=${API_KEY}&steamid=${steamid}`;
  } else if (endpoint === "bans") {
    url = `${STEAM_API_BASE}/ISteamUser/GetPlayerBans/v1/?key=${API_KEY}&steamids=${steamid}`;
  } else if (endpoint === "theme") {
    // We need to fetch the HTML profile page to get the background and frame
    url = `https://steamcommunity.com/profiles/${steamid}`;
  } else if (endpoint === "stats") {
    const appid = searchParams.get("appid");
    url = `${STEAM_API_BASE}/ISteamUserStats/GetUserStatsForGame/v0002/?key=${API_KEY}&steamid=${steamid}&appid=${appid}`;
  } else if (endpoint === "achievements") {
    const appid = searchParams.get("appid");
    url = `${STEAM_API_BASE}/ISteamUserStats/GetPlayerAchievements/v0001/?key=${API_KEY}&steamid=${steamid}&appid=${appid}&l=en`;
  } else if (endpoint === "schema") {
    const appid = searchParams.get("appid");
    url = `${STEAM_API_BASE}/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${appid}`;
  } else if (endpoint === "search") {
    // Use the official Steam community search AJAX
    url = `https://steamcommunity.com/search/SearchCommunityAjax?text=${q}&type=users&sessionid=&filter=users`;
  } else {
    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    
    // Special handling for search which returns HTML
    if (endpoint === "search") {
      const data = await response.json();
      const html = data.html || "";
      
      // Basic regex to find SteamIDs and Names in the returned AJAX html
      // Steam search results contain links like steamcommunity.com/profiles/[ID] or /id/[Vanity]
      const results: any[] = [];
      const profileRegex = /<a class="searchPersonaName" href="https:\/\/steamcommunity\.com\/(id|profiles)\/(.*?)"/g;
      const avatarRegex = /<div class="search_capsule"><img src="(.*?)"/g;
      
      let match;
      const profiles: string[] = [];
      const avatars: string[] = [];
      
      while ((match = profileRegex.exec(html)) !== null) {
        profiles.push(match[2]);
      }
      
      let avatarMatch;
      while ((avatarMatch = avatarRegex.exec(html)) !== null) {
        avatars.push(avatarMatch[1]);
      }

      // Also need to get names
      const nameRegex = /<a class="searchPersonaName".*?>(.*?)<\/a>/g;
      const names: string[] = [];
      let nameMatch;
      while ((nameMatch = nameRegex.exec(html)) !== null) {
        names.push(nameMatch[1].replace(/<.*?>/g, ""));
      }

      for (let i = 0; i < profiles.length; i++) {
        results.push({
          id: profiles[i],
          name: names[i] || "Unknown",
          avatar: avatars[i] || ""
        });
      }

      // Prioritize exact matches (case-sensitive first, then insensitive)
      const query = q || "";
      results.sort((a, b) => {
        const aName = a.name;
        const bName = b.name;
        const aId = a.id;
        const bId = b.id;

        // Exact case-sensitive match
        const aExact = aName === query || aId === query;
        const bExact = bName === query || bId === query;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        // Exact case-insensitive match
        const aLower = aName.toLowerCase() === query.toLowerCase() || aId.toLowerCase() === query.toLowerCase();
        const bLower = bName.toLowerCase() === query.toLowerCase() || bId.toLowerCase() === query.toLowerCase();
        if (aLower && !bLower) return -1;
        if (!aLower && bLower) return 1;

        return 0;
      });

      return NextResponse.json({ success: true, results: results.slice(0, 5) });
    }

    if (endpoint === "theme") {
      const html = await response.text();
      
      // Extract Background
      // Steam usually has a script tag with g_rgProfileData or background-image in styles
      const bgRegex = /background-image: url\( '(.*?)' \)/;
      const bgMatch = html.match(bgRegex);
      const background = bgMatch ? bgMatch[1] : null;

      // Extract Avatar Frame
      const frameRegex = /<div class="profile_header_avatar_frame">[\s\S]*?<img src="(.*?)"/;
      const frameMatch = html.match(frameRegex);
      const frame = frameMatch ? frameMatch[1] : null;

      // Extract Theme Primary Color or Class
      const themeRegex = /<div class="profile_page (.*?)">/;
      const themeMatch = html.match(themeRegex);
      const themeClass = themeMatch ? themeMatch[1] : "";

      return NextResponse.json({ 
        background, 
        frame,
        themeClass
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from Steam" }, { status: 500 });
  }
}
