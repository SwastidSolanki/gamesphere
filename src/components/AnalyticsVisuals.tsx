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

export default function AnalyticsVisuals({ library }: AnalyticsVisualsProps) {
  const { barData, totalLibraryHours } = useMemo(() => {
    const sorted = [...library].sort((a, b) => b.playtime_forever - a.playtime_forever);
    const top7 = sorted.slice(0, 7);
    // Total hours across the entire filtered library (>1h games)
    const totalMinutes = library.reduce((acc, g) => acc + g.playtime_forever, 0);
    const totalLibraryHours = totalMinutes / 60;

    const barData = top7.map(game => {
      const hours = Math.round(game.playtime_forever / 60);
      const pct = totalLibraryHours > 0
        ? ((game.playtime_forever / 60) / totalLibraryHours * 100).toFixed(1)
        : "0";
      const shortName = game.name.length > 16 ? game.name.substring(0, 16) + "..." : game.name;
      return { name: game.name, shortName, hours, pct };
    });

    return { barData, totalLibraryHours };
  }, [library]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-[#111318] border border-white/10 px-4 py-3 rounded-lg shadow-2xl">
          <p className="text-white font-bold text-xs uppercase tracking-widest mb-2 max-w-[200px] leading-snug">{d.name}</p>
          <p className="text-primary font-mono text-lg font-black">{d.hours}h</p>
          <p className="text-zinc-400 font-mono text-xs mt-1">{d.pct}% of tracked playtime</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="bg-black/40 border border-white/5 rounded-xl p-6 md:p-8 backdrop-blur-sm relative group overflow-hidden w-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-primary rounded-full"></div>
          <h3 className="text-sm font-black tracking-[0.3em] uppercase text-white/80">Top 7 Most Played</h3>
        </div>
        <p className="text-xs font-mono text-zinc-500 hidden sm:block">
          hover a bar to see % of playtime
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-[340px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            margin={{ top: 10, right: 10, left: -10, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis
              dataKey="shortName"
              stroke="#ffffff30"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
              tick={{ fontFamily: "monaco, monospace", fill: "#ffffff60" }}
            />
            <YAxis
              stroke="#ffffff30"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}h`}
              tick={{ fontFamily: "monaco, monospace", fill: "#ffffff40" }}
            />
            <Tooltip
              cursor={{ fill: "#ffffff06", radius: 4 }}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="hours"
              radius={[6, 6, 0, 0]}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {barData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
