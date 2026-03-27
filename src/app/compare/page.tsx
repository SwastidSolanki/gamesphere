"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";
import { fetchUnifiedData } from "@/lib/dataFetcher";
import { Search, Loader2, Target, Swords, User, Users, ChevronRight, X, ExternalLink, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Player Search Box ─────────────────────────────────────────────────────────
function PlayerSearchBox({
  label,
  icon,
  placeholder,
  onSelect,
  friends,
  defaultId,
}: {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  onSelect: (id: string, name: string) => void;
  friends?: { steamid: string; name: string; avatar: string }[];
  defaultId?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{ id: string; name: string; avatar?: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tab, setTab] = useState<"search" | "friends">("search");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Set default (self)
  useEffect(() => {
    if (defaultId) {
      fetch(`/api/steam?endpoint=profile&steamid=${defaultId}`)
        .then(r => r.json())
        .then(d => {
          const p = d?.response?.players?.[0];
          if (p) {
            const entry = { id: defaultId, name: p.personaname, avatar: p.avatarfull };
            setSelected(entry);
            onSelect(entry.id, entry.name);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultId]);

  const handleSearch = async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      // First attempt: community search
      const searchRes = await fetch(`/api/steam?endpoint=search&q=${encodeURIComponent(q)}`);
      const searchData = await searchRes.json();

      if (searchData.success && searchData.results?.length > 0) {
        // Filter: only names that EXACTLY match (case-sensitive) or include the query as substring
        const filtered = searchData.results.filter((r: any) =>
          r.name === q || r.id === q
        );
        // If no exact matches, show all results sorted by closeness
        const toShow = filtered.length > 0 ? filtered : searchData.results;
        setResults(toShow);
        setShowDropdown(true);
      } else {
        // Fallback: try vanity URL lookup
        const vanityRes = await fetch(`/api/steam?endpoint=vanity&vanityurl=${encodeURIComponent(q)}`);
        const vanityData = await vanityRes.json();
        if (vanityData.response?.success === 1) {
          const steamid = vanityData.response.steamid;
          const profileRes = await fetch(`/api/steam?endpoint=profile&steamid=${steamid}`);
          const profileData = await profileRes.json();
          const player = profileData?.response?.players?.[0];
          if (player) {
            setResults([{ id: steamid, name: player.personaname, avatar: player.avatarfull }]);
            setShowDropdown(true);
          } else {
            setResults([]);
          }
        } else {
          // Last resort: try as raw steamid
          const profileRes = await fetch(`/api/steam?endpoint=profile&steamid=${q}`);
          const profileData = await profileRes.json();
          const player = profileData?.response?.players?.[0];
          if (player) {
            setResults([{ id: q, name: player.personaname, avatar: player.avatarfull }]);
            setShowDropdown(true);
          } else {
            setResults([]);
          }
        }
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(val), 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch(query);
  };

  const handleSelectResult = (r: any) => {
    const entry = { id: r.id, name: r.name, avatar: r.avatar };
    setSelected(entry);
    onSelect(entry.id, entry.name);
    setShowDropdown(false);
    setQuery("");
  };

  const handleSelectFriend = (f: { steamid: string; name: string; avatar: string }) => {
    setSelected({ id: f.steamid, name: f.name, avatar: f.avatar });
    onSelect(f.steamid, f.name);
  };

  return (
    <GlassCard className="p-6 border-white/10 bg-black/60 backdrop-blur-md shadow-2xl overflow-visible relative">
      <label className="text-[10px] font-black text-primary/60 tracking-[0.4em] block mb-4 uppercase font-mono flex items-center gap-2">
        {icon}
        {label}
      </label>

      {/* Selected Player Display */}
      {selected ? (
        <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl mb-4">
          {selected.avatar ? (
            <img src={selected.avatar} alt={selected.name} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <User className="w-5 h-5 text-zinc-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-black text-white tracking-widest uppercase truncate font-mono">{selected.name}</p>
            <p className="text-[10px] text-zinc-500 font-mono truncate">{selected.id}</p>
          </div>
          <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      ) : (
        <div className="tabs flex gap-2 mb-3">
          <button
            onClick={() => setTab("search")}
            className={cn("px-4 py-1.5 text-[10px] font-black tracking-widest rounded-sm transition-all font-mono uppercase",
              tab === "search" ? "bg-primary text-black" : "bg-white/5 text-zinc-500 hover:bg-white/10")}
          >
            <Search className="w-3 h-3 inline mr-1.5" />Search
          </button>
          {friends && friends.length > 0 && (
            <button
              onClick={() => setTab("friends")}
              className={cn("px-4 py-1.5 text-[10px] font-black tracking-widest rounded-sm transition-all font-mono uppercase",
                tab === "friends" ? "bg-primary text-black" : "bg-white/5 text-zinc-500 hover:bg-white/10")}
            >
              <Users className="w-3 h-3 inline mr-1.5" />Friends ({friends.length})
            </button>
          )}
        </div>
      )}

      {/* Search Tab */}
      {!selected && tab === "search" && (
        <div className="relative">
          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
              placeholder={placeholder}
              className="w-full bg-zinc-950/50 border border-white/10 p-4 rounded-xl font-mono text-sm tracking-widest focus:border-primary/40 focus:outline-none transition-all pl-12 text-white placeholder:text-zinc-700 font-bold"
            />
            <Search className="absolute left-4 top-4 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
            {loading && <Loader2 className="absolute right-4 top-4 w-4 h-4 text-primary animate-spin" />}
          </div>

          {/* Dropdown results */}
          <AnimatePresence>
            {showDropdown && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
              >
                {results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectResult(r)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group text-left border-b border-white/5 last:border-0"
                  >
                    {r.avatar ? (
                      <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-zinc-600" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-white text-sm tracking-wider uppercase truncate font-mono group-hover:text-primary transition-colors">{r.name}</p>
                      <p className="text-[10px] text-zinc-600 font-mono truncate">{r.id}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-primary transition-colors shrink-0" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Friends Tab */}
      {!selected && tab === "friends" && friends && (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scroll">
          {friends.map((f) => (
            <button
              key={f.steamid}
              onClick={() => handleSelectFriend(f)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl transition-all group text-left"
            >
              {f.avatar ? (
                <img src={f.avatar} alt={f.name} className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-zinc-600" />
                </div>
              )}
              <span className="font-black text-sm text-white tracking-wider uppercase truncate font-mono group-hover:text-primary transition-colors min-w-0 flex-1">{f.name}</span>
              <ChevronRight className="w-4 h-4 ml-auto text-zinc-700 group-hover:text-primary transition-colors shrink-0" />
            </button>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

// ─── Main Compare Page ─────────────────────────────────────────────────────────
export default function ComparePage() {
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<{ steamid: string; name: string; avatar: string }[]>([]);
  const [savedId, setSavedId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem("gamesphere_steam_id");
    if (stored) {
      setSavedId(stored);
      setId1(stored);
      // Fetch friends list
      fetch(`/api/steam?endpoint=friends&steamid=${stored}`)
        .then(r => r.json())
        .then(async d => {
          const friendIds: string[] = d?.friendslist?.friends?.map((f: any) => f.steamid) || [];
          if (friendIds.length === 0) return;
          const batchIds = friendIds.slice(0, 50).join(",");
          const summRes = await fetch(`/api/steam?endpoint=summaries&steamids=${batchIds}`);
          const summData = await summRes.json();
          const players = summData?.response?.players || [];
          setFriends(players.map((p: any) => ({ steamid: p.steamid, name: p.personaname, avatar: p.avatarfull })));
        });
    }
  }, []);

  const handleCompare = async () => {
    if (!id1 || !id2) return;
    setLoading(true);
    try {
      const p1 = await fetchUnifiedData(id1, "", "");
      const p2 = await fetchUnifiedData(id2, "", "");
      setResults({ p1, p2 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const canCompare = id1 && id2 && id1 !== id2;

  // Calculate common games
  const commonGames = results ? (() => {
    const set1 = new Set(results.p1.steam.library.map((g: any) => g.appid));
    return results.p2.steam.library.filter((g: any) => set1.has(g.appid)).length;
  })() : 0;

  // Win probability based on multiple factors (totalPlaytime is already in hours)
  const winProb = results ? (() => {
    const h1 = results.p1.steam.totalPlaytime;
    const h2 = results.p2.steam.totalPlaytime;
    const l1 = results.p1.steam.level || 0;
    const l2 = results.p2.steam.level || 0;
    const g1 = results.p1.steam.library.length;
    const g2 = results.p2.steam.library.length;
    const score1 = h1 * 0.5 + l1 * 2 + g1 * 0.2;
    const score2 = h2 * 0.5 + l2 * 2 + g2 * 0.2;
    const total = score1 + score2;
    return total > 0 ? Math.round((score1 / total) * 100) : 50;
  })() : 50;

  const p1Wins = results && winProb > 50;

  return (
    <main className="min-h-screen bg-[#0d0f14] text-white selection:bg-primary/30 selection:text-black overflow-x-hidden">
      <Navbar />
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 pt-0 md:pt-0 pb-20">

        {/* Header */}
        <div className="relative z-10 mb-16 font-heading text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-6 w-full">
            <span className="w-8 h-[1px] md:w-12 bg-primary opacity-60" />
            <p className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.6em] text-red-500 uppercase">Competitive Arbitration // Data Comparison</p>
            <span className="w-8 h-[1px] md:w-12 bg-primary opacity-60" />
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-black tracking-tighter mb-8 md:mb-10 uppercase leading-[0.8] text-center">
            FATES <br /><span className="text-red-500">INTERTWINED</span>
          </h1>
          <p className="text-zinc-500 max-w-3xl mx-auto font-mono text-xs md:text-sm tracking-[0.2em] uppercase leading-relaxed opacity-70 text-center">
            Search any Steam player by username. Select from your friends list. Compare two profiles side-by-side.
          </p>
        </div>

        {/* Search Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <PlayerSearchBox
              label="Player 1 · Your Profile"
              icon={<User className="w-3 h-3" />}
              placeholder="Search username…"
              defaultId={savedId}
              friends={friends}
              onSelect={(id, name) => { setId1(id); setName1(name); }}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <PlayerSearchBox
              label="Player 2 · Opponent Profile"
              icon={<Target className="w-3 h-3" />}
              placeholder="Search opponent username…"
              friends={friends}
              onSelect={(id, name) => { setId2(id); setName2(name); }}
            />
          </motion.div>
        </div>

        {/* Sync Button */}
        <motion.button
          onClick={handleCompare}
          disabled={loading || !canCompare}
          whileHover={{ scale: canCompare ? 1.01 : 1 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-6 bg-white/5 border border-white/10 text-white font-black tracking-[0.6em] mb-20 hover:bg-primary/10 hover:border-primary/30 transition-all flex items-center justify-center gap-4 disabled:opacity-20 rounded-xl group relative overflow-hidden uppercase text-xs"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 flex items-center gap-3">
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> SYNCHRONIZING DATA…</>
            ) : (
              <><Swords className="w-5 h-5 text-red-500" /> START PERFORMANCE ANALYSIS</>
            )}
          </span>
        </motion.button>

        {/* Results */}
        <AnimatePresence mode="wait">
          {results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Player Cards + Stats Row */}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 items-start">
                {/* Unit 01 Card */}
                <div className={cn("lg:col-span-2", !p1Wins && "hidden lg:block")}>
                  <PlayerCompareCard player={results.p1} isWinner={p1Wins} />
                </div>

                {/* Middle: VS + Combat Stats */}
                <div className="lg:col-span-3 space-y-8">
                  {/* Hidden on Mobile: VS Center Piece + Basic Metrics */}
                  <div className="hidden md:block">
                    {/* VS Center piece */}
                    <div className="flex flex-col items-center gap-3 py-6 md:py-12">
                      <div className="relative mt-8 md:mt-0">
                        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center shadow-[0_0_80px_rgba(0,0,0,0.9)]">
                          <Swords className="w-8 h-8 md:w-12 md:h-12 text-red-500" />
                        </div>
                        <div className="absolute -bottom-6 md:-bottom-8 left-1/2 -translate-x-1/2 text-lg md:text-2xl font-black text-primary tracking-[0.8em] font-mono italic">VS</div>
                      </div>
                    </div>

                    {/* Metric Comparisons */}
                    <div className="space-y-3 pt-4">
                      <MetricComp label="Total Logged Hours" val1={Math.round(results.p1.steam.totalPlaytime)} val2={Math.round(results.p2.steam.totalPlaytime)} unit="H" />
                      <MetricComp label="Game Manifest Count" val1={results.p1.steam.library.length} val2={results.p2.steam.library.length} />
                      <MetricComp label="Account Level" val1={results.p1.steam.level || 0} val2={results.p2.steam.level || 0} prefix="LVL " />
                    </div>
                  </div>

                  {/* Combat Matrix */}
                  <div className="pt-10 space-y-5">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-2 h-8 md:h-12 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]" />
                      <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic font-heading">Performance Matrix</h3>
                    </div>

                    {/* Battle breakdown per stat */}
                    {(() => {
                      const p1 = results.p1.steam;
                      const p2 = results.p2.steam;
                      const n1 = p1.profile.personaname;
                      const n2 = p2.profile.personaname;
                      const categories = [
                        { label: "Hours Played", v1: Math.round(p1.totalPlaytime), v2: Math.round(p2.totalPlaytime), suffix: "H", color: "#00e5ff" },
                        { label: "Library Size", v1: p1.library.length, v2: p2.library.length, suffix: "", color: "#a855f7" },
                        { label: "Steam Level", v1: p1.level || 0, v2: p2.level || 0, suffix: "", color: "#4a90d9" },
                        { label: "Hr / Game Ratio", v1: p1.library.length ? Math.round(p1.totalPlaytime / p1.library.length * 10) / 10 : 0, v2: p2.library.length ? Math.round(p2.totalPlaytime / p2.library.length * 10) / 10 : 0, suffix: "H", color: "#22c55e" },
                        { label: "Achievements", v1: p1.achievements || 0, v2: p2.achievements || 0, suffix: "", color: "#f59e0b" },
                      ];
                      const p1Cats = categories.filter(c => c.v1 > c.v2).length;
                      const p2Cats = categories.filter(c => c.v2 > c.v1).length;

                      return (
                        <div className="space-y-3">
                          {categories.map((cat, i) => {
                            const max = Math.max(cat.v1, cat.v2, 1);
                            const pct1 = Math.round((cat.v1 / max) * 100);
                            const pct2 = Math.round((cat.v2 / max) * 100);
                            const w1 = cat.v1 > cat.v2;
                            const w2 = cat.v2 > cat.v1;
                            return (
                              <div key={i} className="bg-black/50 border border-white/5 rounded-xl p-6 group hover:border-white/10 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4 mb-4 text-center">
                                  {/* Mobile label placed at top */}
                                  <p className="text-[10px] md:text-[11px] font-mono text-zinc-500 tracking-[0.3em] md:hidden uppercase font-black mb-2">{cat.label}</p>
                                  <div className="flex items-center justify-between w-full">
                                    <span className={cn("text-base md:text-xl font-black font-mono flex items-center gap-1.5 md:gap-2", w1 ? "text-primary" : "text-zinc-600")}>
                                      {cat.v1.toLocaleString()}{cat.suffix}
                                      {w1 && <span className="text-[9px] bg-primary text-black px-1.5 py-0.5 rounded-sm font-black">WIN</span>}
                                    </span>
                                    {/* Desktop label placed in center */}
                                    <p className="hidden md:block text-[11px] font-mono text-zinc-500 tracking-[0.3em] uppercase font-black mx-2">{cat.label}</p>
                                    <span className={cn("text-base md:text-xl font-black font-mono flex items-center justify-end gap-1.5 md:gap-2 text-right", w2 ? "text-primary" : "text-zinc-600")}>
                                      {w2 && <span className="text-[9px] bg-primary text-black px-1.5 py-0.5 rounded-sm font-black">WIN</span>}
                                      {cat.v2.toLocaleString()}{cat.suffix}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden flex justify-end">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct1}%` }}
                                      transition={{ duration: 0.8, delay: i * 0.1, ease: "circOut" }}
                                      className="h-full rounded-full"
                                      style={{ background: w1 ? cat.color : "rgba(255,255,255,0.1)" }}
                                    />
                                  </div>
                                  <div className="w-2 h-2 rounded-full bg-white/10 shrink-0" />
                                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct2}%` }}
                                      transition={{ duration: 0.8, delay: i * 0.1, ease: "circOut" }}
                                      className="h-full rounded-full"
                                      style={{ background: w2 ? cat.color : "rgba(255,255,255,0.1)" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Score tally + verdict */}
                          <div className={cn(
                            "mt-4 p-5 rounded-xl border text-center relative overflow-hidden",
                            p1Cats >= p2Cats ? "bg-primary/5 border-primary/20" : "bg-red-500/5 border-red-500/20"
                          )}>
                            <div className="flex items-center justify-center gap-6 mb-3">
                              <div className="text-center">
                                <div className="text-3xl font-black font-mono text-white">{p1Cats}</div>
                                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest truncate max-w-[80px]">{n1.substring(0, 12)}</div>
                              </div>
                              <div className="text-zinc-700 font-black font-mono text-xl">:</div>
                              <div className="text-center">
                                <div className="text-3xl font-black font-mono text-white">{p2Cats}</div>
                                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest truncate max-w-[80px]">{n2.substring(0, 12)}</div>
                              </div>
                            </div>

                            {/* Hesitation is Defeat Red highlight */}
                            <div className="text-[16px] font-black tracking-[0.5em] uppercase font-mono text-red-600 mb-2 drop-shadow-[0_0_12px_rgba(220,38,38,0.7)] pb-4">
                              HESITATION IS DEFEAT.
                            </div>

                            <p className="text-[10px] font-mono tracking-[0.4em] uppercase font-black text-zinc-400">
                              {p1Cats > p2Cats
                                ? `${n1.toUpperCase()} // COMBAT SUPERIORITY`
                                : p2Cats > p1Cats
                                  ? `${n2.toUpperCase()} // TACTICAL ADVANTAGE`
                                  : "⚡ EQUILIBRIUM DETECTED // DEADLOCK"}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Unit 02 Card */}
                <div className={cn("lg:col-span-2", p1Wins && "hidden lg:block")}>
                  <PlayerCompareCard player={results.p2} isWinner={!p1Wins} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function PlayerCompareCard({ player, isWinner }: { player: any; isWinner: boolean }) {
  const profile = player.steam.profile;
  const level = player.steam.level ?? 0;
  const isOnline = profile.personastate === 1;

  return (
    <GlassCard className={cn(
      "p-8 border-2 bg-black/40 backdrop-blur-md shadow-2xl transition-all hover:shadow-primary/10 min-h-[550px]",
      isWinner
        ? "border-primary/50 shadow-[0_0_40px_rgba(0,229,255,0.12)]"
        : "border-white/5 opacity-80"
    )}>
      <div className="min-h-[32px] mb-4">
        {isWinner && (
          <div className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-sm text-center flex items-center justify-center gap-3">
            <Trophy className="w-3 h-3 text-primary" />
            <p className="text-[9px] font-black text-primary tracking-[0.5em] font-mono uppercase">VICTOR</p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center text-center gap-5">
        <div className="relative">
          <div className={cn(
            "w-32 h-32 rounded-2xl border-4 overflow-hidden shadow-2xl",
            isWinner ? "border-primary/50 shadow-[0_0_30px_rgba(0,229,255,0.2)]" : "border-white/10"
          )}>
            <img
              src={profile.avatarfull || ""}
              className="w-full h-full object-cover grayscale-[0.2]"
              alt={profile.personaname}
            />
          </div>
          <div className={cn(
            "absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full border-2 border-[#0d0e12]",
            isOnline ? "bg-green-500" : "bg-zinc-600"
          )} />
        </div>

        <div>
          <p className="text-2xl md:text-3xl font-black tracking-tighter mb-1 uppercase text-white drop-shadow-2xl">{profile.personaname}</p>
          <p className="text-zinc-600 text-[10px] font-bold tracking-[0.4em] font-mono uppercase">
            {profile.loccountrycode || "GLOBAL"} // {isOnline ? "ONLINE" : "OFFLINE"}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4a90d9] to-[#1a5fa8] rounded-sm border border-white/20 shadow-[0_0_15px_rgba(74,144,217,0.4)]">
          <span className="text-white font-black text-base tracking-widest">Level {level}</span>
        </div>

        <div className="w-full space-y-2 pt-2 text-left">
          <div className="flex justify-between px-2">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Hours</span>
            <span className="text-[10px] text-white font-black font-mono">{Math.round(player.steam.totalPlaytime)}H</span>
          </div>
          <div className="flex justify-between px-2">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Games</span>
            <span className="text-[10px] text-white font-black font-mono">{player.steam.library.length}</span>
          </div>
        </div>

        <a
          href={profile.profileurl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-2 py-2.5 text-[9px] font-black tracking-[0.5em] text-zinc-500 border border-white/5 rounded-xl hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2 group"
        >
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          VIEW STEAM PROFILE
        </a>
      </div>
    </GlassCard>
  );
}

function MetricComp({ label, val1, val2, unit = "", prefix = "" }: { label: string; val1: number; val2: number; unit?: string; prefix?: string }) {
  const diff = val1 - val2;
  const max = Math.max(Math.abs(val1), Math.abs(val2), 1);
  const pct = Math.round((Math.max(val1, val2) / max) * 100);

  return (
    <div className="bg-black/40 p-5 rounded-xl border border-white/5 group hover:border-white/10 transition-all">
      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3 text-center font-mono">{label}</p>
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="w-20 text-center shrink-0">
          <span className={cn("text-xl font-black font-heading transition-all", diff > 0 ? "text-primary" : "text-zinc-600")}>
            {prefix}{Math.round(val1).toLocaleString()}{unit}
          </span>
        </div>
        <div className="h-[2px] flex-1 bg-white/5 relative rounded-full overflow-hidden">
          <div className={cn(
            "absolute inset-0 transition-all duration-1000 rounded-full",
            diff > 0 ? "bg-gradient-to-r from-primary/60 to-transparent" : "bg-gradient-to-l from-primary/60 to-transparent"
          )} />
        </div>
        <div className="w-20 text-center shrink-0">
          <span className={cn("text-xl font-black font-heading transition-all", diff < 0 ? "text-primary" : "text-zinc-600")}>
            {prefix}{Math.round(val2).toLocaleString()}{unit}
          </span>
        </div>
      </div>
    </div>
  );
}
