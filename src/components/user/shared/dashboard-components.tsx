import React from "react";
import { TIMEFRAME, Timeframe } from "@/constants/fitness.constant";

//  Shared chart styling
export const gridColor  = "rgba(255,255,255,0.08)";
export const tickColor  = "rgba(255,255,255,0.45)";
export const baseScales = {
  x: { grid: { display: false }, ticks: { color: tickColor } },
  y: { min: 0, grid: { color: gridColor }, ticks: { color: tickColor } },
};
export const baseLegend = { display: false };

//  Macro/Pie colour palette
export const PIE_COLORS = [
  "#ef4444", "#f59e0b", "#3b82f6", "#a855f7", "#10b981", "#6366f1",
  "#ec4899", "#06b6d4", "#84cc16", "#14b8a6", "#f43f5e", "#d946ef",
  "#0ea5e9", "#8b5cf6"
];
export const PIE_COLORS_DIM = [
  "#ef444480", "#f59e0b80", "#3b82f680", "#a855f780", "#10b98180", "#6366f180",
  "#ec489980", "#06b6d480", "#84cc1680", "#14b8a680", "#f43f5e80", "#d946ef80",
  "#0ea5e980", "#8b5cf680"
];

//  Timeframe selector
export const TIME_TABS: { label: string; value: Timeframe; sub: string }[] = [
  { label: "7 Days",    value: TIMEFRAME.DAILY,   sub: "last 7 days"  },
  { label: "30 Days",   value: TIMEFRAME.WEEKLY,  sub: "last 30 days" },
  { label: "12 Months", value: TIMEFRAME.MONTHLY, sub: "last 12 months" },
];

export const WORKOUT_TIME_TABS: { label: string; value: Timeframe; sub: string }[] = [
  { label: "Daily",    value: TIMEFRAME.DAILY,   sub: "daily progress"  },
  { label: "Weekly",   value: TIMEFRAME.WEEKLY,  sub: "weekly progress" },
  { label: "Monthly", value: TIMEFRAME.MONTHLY, sub: "monthly progress" },
];

//  Reusable Card
export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col ${className}`}>
    {children}
  </div>
);

//  Summary Stat Card
export const StatCard = ({
  icon,
  label,
  value,
  sub,
  iconClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  iconClass: string;
}) => (
  <Card className="items-center justify-center text-center gap-2">
    <div className={`p-3 rounded-xl ${iconClass} mb-1`}>{icon}</div>
    <p className="text-white/55 text-xs font-medium uppercase tracking-widest">{label}</p>
    <h2 className="text-2xl font-extrabold text-white">{value}</h2>
    {sub && <p className="text-white/40 text-xs">{sub}</p>}
  </Card>
);

//  Chart helper
export const ChartCard = ({
  title,
  height = "h-56",
  children,
}: {
  title: string;
  height?: string;
  children: React.ReactNode;
}) => (
  <Card className={`${height}`}>
    <h3 className="text-sm font-bold text-white/70 mb-3 uppercase tracking-wider">{title}</h3>
    <div className="flex-grow relative">{children}</div>
  </Card>
);

//  Dataset Builders
export const lineDataset = (label: string, values: number[], color: string) => ({
  label,
  data: values,
  borderColor: color,
  backgroundColor: color.replace(")", ", 0.15)").replace("rgb", "rgba").replace("#", "rgba(0,0,0,0.15)"), // Basic hex fallback
  fill: true,
  tension: 0.4,
  pointRadius: 3,
  pointHoverRadius: 5,
});

export const barDataset = (label: string, values: number[], color: string) => ({
  label,
  data: values,
  backgroundColor: color,
  borderRadius: 5,
  barPercentage: 0.55,
});
