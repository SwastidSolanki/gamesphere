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
    // URL will be constructed dynamically below to bypass WAF
    url = "dynamic_search";
  } else {
    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  }

  try {
    let finalUrl = url;
    const headers: any = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    };

    if (endpoint === "search") {
      // 1. Visit main page to get a session cookie to bypass WAF
      const initRes = await fetch("https://steamcommunity.com/", { cache: "no-store", headers });
      const cookies = initRes.headers.get("set-cookie") || "";
      const sessionMatch = cookies.match(/sessionid=([^;]+)/);
      const sessionId = sessionMatch ? sessionMatch[1] : "";
      
      headers["Cookie"] = cookies;
      finalUrl = `https://steamcommunity.com/search/SearchCommunityAjax?text=${q}&filter=users&sessionid=${sessionId}&steamid_user=false&page=1`;
    }

    const response = await fetch(finalUrl, { cache: "no-store", headers });
    
    // Special handling for search which returns HTML
    if (endpoint === "search") {
      const data = await response.json();
      const html = data.html || "";
      
      const results: any[] = [];
      // Robust regex that groups avatar, id string, and name strictly within the same search_row definition
      const rowRegex = /class="search_row"[\s\S]*?<img src="(.*?)"[\s\S]*?<a class="searchPersonaName" href="https:\/\/steamcommunity\.com\/(?:id|profiles)\/([^"]*?)">(.*?)<\/a>/g;
      
      let match;
      while ((match = rowRegex.exec(html)) !== null) {
        let avatar = match[1];
        // Clean trailing slash or query params
        let idUrlPart = match[2].split('?')[0].replace(/\/$/, "");
        // Clean spans matching the query e.g. `<span class="match">user</span>`
        let nameHtml = match[3].replace(/<.*?>/g, "");
        
        results.push({
          id: idUrlPart,
          name: nameHtml,
          avatar: avatar
        });
      }

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
