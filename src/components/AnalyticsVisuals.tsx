"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface AnalyticsVisualsProps {
  library: any[];
}

const COLORS = ["#00e5ff", "#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#f43f5e", "#6366f1"];

// Name Sanitizer: Removes common cluttered symbols and redundant prefixes
function sanitizeName(name: string) {
  return name
    .replace(/EA SPORTS\s/gi, "") // Remove 'EA SPORTS ' prefix
    .replace(/™|©|®/g, "")       // Remove trademark symbols
    .replace(/Digital Dedicated Server/gi, "Server")
    .replace(/Counter-Strike/gi, "CS")
    .trim();
}

export default function AnalyticsVisuals({ library }: AnalyticsVisualsProps) {
  const { barData, totalLibraryHours } = useMemo(() => {
    const sorted = [...library].sort((a, b) => b.playtime_forever - a.playtime_forever);
    const top7 = sorted.slice(0, 7);
    
    const totalMinutes = library.reduce((acc, g) => acc + g.playtime_forever, 0);
    const totalLibraryHours = totalMinutes / 60;

    const barData = top7.map(game => {
      const hours = Math.round(game.playtime_forever / 60);
      const pct = totalLibraryHours > 0
        ? ((game.playtime_forever / 60) / totalLibraryHours * 100).toFixed(1)
        : "0";
      
      const cleanName = sanitizeName(game.name);
      const shortName = cleanName.length > 20 ? cleanName.substring(0, 18) + "..." : cleanName;
      
      return { 
        fullName: game.name,
        name: shortName, 
        hours, 
        pct 
      };
    });

    return { barData, totalLibraryHours };
  }, [library]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-[#111318] border border-white/10 px-4 py-3 rounded-lg shadow-2xl backdrop-blur-md">
          <p className="text-white font-black text-xs uppercase tracking-widest mb-1 max-w-[220px] leading-snug">
            {d.fullName.toUpperCase()}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-primary font-mono text-xl font-black italic">{d.hours}H</p>
          </div>
          <p className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase border-t border-white/5 pt-2">
            {d.pct}% OF TOTAL ARCHIVE
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, duration: 0.6 }}
      className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-10 backdrop-blur-md relative group overflow-hidden w-full shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Ticker HUD accents */}
      <div className="absolute top-0 right-0 p-4 flex gap-1 items-center opacity-20 h-10 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-6 h-[1px] bg-primary animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="w-8 h-1 bg-primary rounded-full"></div>
            <div className="w-4 h-1 bg-primary/40 rounded-full"></div>
          </div>
          <h3 className="text-xl md:text-2xl font-black tracking-[0.4em] uppercase text-white leading-none">
            Combat_Analytics
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 hidden sm:flex uppercase tracking-[0.2em]">
          <span className="w-2 h-2 rounded-full border border-zinc-600"></span>
          SCANNING ARCHIVES...
        </div>
      </div>

      {/* Chart: Horizontal Layout */}
      <div className="w-full h-[460px] relative z-10 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 10, bottom: 20 }}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#ffffff08" horizontal={true} vertical={false} />
            
            {/* Y-Axis for Names - Much clearer in horizontal layout */}
            <YAxis
              dataKey="name"
              type="category"
              stroke="#ffffff30"
              fontSize={13}
              tickLine={false}
              axisLine={false}
              width={140}
              tick={{ 
                fontFamily: "var(--font-heading)", 
                fill: "#ffffffa0", 
                fontWeight: 900,
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}
            />
            
            {/* X-Axis for Hours */}
            <XAxis
              type="number"
              stroke="#ffffff20"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}h`}
              tick={{ fontFamily: "monaco, monospace", fill: "#ffffff40" }}
              domain={[0, 'dataMax + 10']}
            />
            
            <Tooltip
              cursor={{ fill: "#ffffff06", radius: 8 }}
              content={<CustomTooltip />}
            />
            
            <Bar
              dataKey="hours"
              radius={[0, 8, 8, 0]}
              animationDuration={2000}
              animationEasing="ease-in-out"
              barSize={32}
            >
              {barData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.8}
                  className="hover:fill-opacity-100 transition-all duration-300 shadow-2xl"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-between items-center relative z-10 border-t border-white/5 pt-6">
        <p className="text-[9px] font-black text-zinc-600 tracking-[0.4em] uppercase">ARCHIVE_TYPE: STEAM_LIBRARY</p>
        <p className="text-[9px] font-black text-primary/40 tracking-[0.4em] uppercase">SYSTEM_STABLE // 100%_SYNC</p>
      </div>
    </motion.div>
  );
}
