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
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface AnalyticsVisualsProps {
  library: any[];
}

const COLORS = ["#00e5ff", "#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#f43f5e", "#6366f1", "#14b8a6"];

export default function AnalyticsVisuals({ library }: AnalyticsVisualsProps) {
  const chartData = useMemo(() => {
    // Top 7 games by playtime
    const sorted = [...library].sort((a, b) => b.playtime_forever - a.playtime_forever);
    const top7 = sorted.slice(0, 7);
    
    // Format for BarChart
    const barData = top7.map(game => ({
      name: game.name,
      shortName: game.name.length > 15 ? game.name.substring(0, 15) + "..." : game.name,
      hours: Math.round(game.playtime_forever / 60)
    }));

    // Format for PieChart (Top 5 + Others)
    const pieData = top7.slice(0, 5).map(game => ({
      name: game.name,
      value: Math.round(game.playtime_forever / 60)
    }));
    
    const othersPlaytime = sorted.slice(5).reduce((acc, game) => acc + game.playtime_forever, 0);
    if (othersPlaytime > 0) {
      pieData.push({
        name: "Other Games",
        value: Math.round(othersPlaytime / 60)
      });
    }

    return { barData, pieData };
  }, [library]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 border border-white/10 p-3 rounded-lg backdrop-blur-md shadow-xl z-50">
          <p className="text-white font-bold text-xs uppercase tracking-widest mb-1">{payload[0].payload.name || label}</p>
          <p className="text-primary font-mono text-sm">{payload[0].value} Hours Logs</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Bar Chart Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-black/40 border border-white/5 rounded-xl p-6 backdrop-blur-sm relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-white/80">Top 7 Asset Engagement</h3>
        </div>

        <div className="w-full h-[300px] relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              <XAxis 
                dataKey="shortName" 
                stroke="#ffffff40" 
                fontSize={9} 
                tickLine={false}
                axisLine={false}
                fontFamily="monaco, monospace"
              />
              <YAxis 
                stroke="#ffffff40" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}h`}
                fontFamily="monaco, monospace"
              />
              <Tooltip cursor={{ fill: '#ffffff05' }} content={<CustomTooltip />} />
              <Bar 
                dataKey="hours" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {chartData.barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pie Chart Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-black/40 border border-white/5 rounded-xl p-6 backdrop-blur-sm relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-white/80">Global Playtime Distribution</h3>
        </div>

        <div className="w-full h-[300px] flex items-center justify-center relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, fontFamily: 'monaco, monospace' }}
              />
              <Pie
                data={chartData.pieData}
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {chartData.pieData.map((entry, index) => (
                  <Cell 
                    key={`pie-${index}`} 
                    fill={entry.name === "Other Games" ? "#1f1f1f" : COLORS[index % COLORS.length]} 
                    className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
