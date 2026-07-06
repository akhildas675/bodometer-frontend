import React, { useCallback, useEffect, useState } from "react";
import {
  Activity,
  Droplets,
  Flame,
  Moon,
  Utensils,
  Footprints,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import {
  HealthLogProgressResponseDto,
} from "@/modules/health-log/types/health-log.interface";
import { healthLogService } from '@/modules/health-log/service/health-log.service';
import { TIMEFRAME, Timeframe } from "@/constants/fitness.constant";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

import {
  Card,
  StatCard,
  ChartCard,
  TIME_TABS,
  baseScales,
  baseLegend,
  tickColor,
  PIE_COLORS,
  PIE_COLORS_DIM,
  lineDataset,
  barDataset
} from "@/ui.components/shared/dashboard-components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

//  Main component
const UserHealthProgression = () => {
  const [data, setData] = useState<HealthLogProgressResponseDto | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>(TIMEFRAME.DAILY);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await healthLogService.getHealthLogProgress(timeframe);
      if (res.success && res.data) setData(res.data);
    } catch (e) {
      console.error("Health progress fetch failed", e);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  const { refetch } = useFetch(fetchProgress);
  useEffect(() => { refetch(); }, [timeframe, refetch]);

  //  Derived chart arrays
  const labels         = data?.trendData.map(d => d.label)   ?? [];
  const caloriesSeries = data?.trendData.map(d => d.calories) ?? [];
  const proteinSeries  = data?.trendData.map(d => d.protein)  ?? [];
  const sleepSeries    = data?.trendData.map(d => d.sleep)    ?? [];
  const waterSeries    = data?.trendData.map(d => d.water)    ?? [];
  const stepsSeries    = data?.trendData.map(d => d.steps)    ?? [];

  const macroLabels = data?.macroDistribution.map(d => `${d.macroName} (${d.percentage}%)`) ?? [];
  const macroValues = data?.macroDistribution.map(d => d.amount) ?? [];

  const currentTab = TIME_TABS.find((t) => t.value === timeframe)!;

  //  Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-emerald-400">
        <Activity className="w-10 h-10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto text-white w-full px-4 md:px-8 py-6 space-y-8">

      {/*  Page Header  */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            <span className="bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              Health Progress
            </span>
          </h1>
          <p className="text-white/45 text-sm mt-1">
            Nutrition, sleep, hydration & activity trends — {currentTab.sub}
          </p>
        </div>

        {/* Timeframe tabs */}
        <div className="flex space-x-1 bg-white/5 border border-white/10 p-1 rounded-xl shrink-0">
          {TIME_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setTimeframe(tab.value)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                timeframe === tab.value
                  ? "bg-emerald-600 text-white shadow"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/*  Summary Cards  */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={<Flame  className="w-5 h-5 text-orange-400"  />} iconClass="bg-orange-400/10" label="Avg Calories" value={`${data?.averageCalories ?? 0}`}  sub="kcal / day"  />
        <StatCard icon={<Utensils className="w-5 h-5 text-rose-400"  />} iconClass="bg-rose-400/10"   label="Avg Protein"  value={`${data?.averageProtein  ?? 0} g`} sub="per day"    />
        <StatCard icon={<Moon    className="w-5 h-5 text-blue-400"   />} iconClass="bg-blue-400/10"   label="Avg Sleep"   value={`${data?.averageSleep    ?? 0} h`} sub="per night"  />
        <StatCard icon={<Droplets className="w-5 h-5 text-cyan-400"  />} iconClass="bg-cyan-400/10"   label="Avg Water"   value={`${data?.averageWater    ?? 0} L`} sub="per day"    />
        <StatCard icon={<Footprints className="w-5 h-5 text-emerald-400" />} iconClass="bg-emerald-400/10" label="Avg Steps" value={(data?.averageSteps ?? 0).toLocaleString()} sub="per day" />
        <StatCard icon={<CalendarDays className="w-5 h-5 text-purple-400" />} iconClass="bg-purple-400/10" label="Streak" value={`${data?.currentStreak ?? 0}`} sub="days logged" />
      </div>

      {/*  Daily Nutrition Summary  */}
      {data?.dailySummary && (
        <Card>
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">
            Daily Nutrition Summary
            <span className="ml-2 text-emerald-400 font-normal normal-case tracking-normal">
              — {data.dailySummary.date}
            </span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Calories",  value: `${data.dailySummary.totalCalories} kcal`, color: "text-orange-400" },
              { label: "Protein",   value: `${data.dailySummary.totalProtein} g`,     color: "text-rose-400"   },
              { label: "Carbs",     value: `${data.dailySummary.totalCarbs} g`,       color: "text-amber-400"  },
              { label: "Fat",       value: `${data.dailySummary.totalFat} g`,         color: "text-blue-400"   },
            ].map(item => (
              <div key={item.label} className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">{item.label}</p>
                <p className={`text-xl font-extrabold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/*  Line: Calories Trend  */}
      <ChartCard title="Daily Calories Trend (kcal)" height="h-64">
        <Line
          options={{ responsive: true, maintainAspectRatio: false, scales: baseScales, plugins: { legend: baseLegend } }}
          data={{
            labels,
            datasets: [lineDataset("Calories (kcal)", caloriesSeries, "rgb(251,146,60)")],
          }}
        />
      </ChartCard>

      {/*  Line: Protein Trend  */}
      <ChartCard title="Protein Intake Trend (g)" height="h-64">
        <Line
          options={{ responsive: true, maintainAspectRatio: false, scales: baseScales, plugins: { legend: baseLegend } }}
          data={{
            labels,
            datasets: [lineDataset("Protein (g)", proteinSeries, "rgb(248,113,113)")],
          }}
        />
      </ChartCard>

      {/*  Line: Sleep Trend  */}
      <ChartCard title="Sleep Duration Trend (hours)" height="h-64">
        <Line
          options={{ responsive: true, maintainAspectRatio: false, scales: baseScales, plugins: { legend: baseLegend } }}
          data={{
            labels,
            datasets: [lineDataset("Sleep (h)", sleepSeries, "rgb(96,165,250)")],
          }}
        />
      </ChartCard>

      {/*  Bar: Water + Steps side by side  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Water Intake (L)" height="h-64">
          <Bar
            options={{ responsive: true, maintainAspectRatio: false, scales: baseScales, plugins: { legend: baseLegend } }}
            data={{
              labels,
              datasets: [barDataset("Water (L)", waterSeries, "#22d3ee")],
            }}
          />
        </ChartCard>

        <ChartCard title="Daily Steps" height="h-64">
          <Bar
            options={{ responsive: true, maintainAspectRatio: false, scales: baseScales, plugins: { legend: baseLegend } }}
            data={{
              labels,
              datasets: [barDataset("Steps", stepsSeries, "#10b981")],
            }}
          />
        </ChartCard>
      </div>

      {/*  Pie: Macronutrient Distribution  */}
      <Card className="min-h-[28rem]">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">
          Macronutrient Distribution (avg per day)
        </h3>
        <div className="w-full min-h-[22rem] relative flex items-center justify-center">
          {macroValues.some(v => v > 0) ? (
            <Pie
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                    labels: { color: tickColor, padding: 20 },
                  },
                  tooltip: {
                    callbacks: {
                      label: ctx => ` ${ctx.label}: ${ctx.raw} g`,
                    },
                  },
                },
              }}
              data={{
                labels: macroLabels,
                datasets: [{
                  data: macroValues,
                  backgroundColor: PIE_COLORS,
                  hoverBackgroundColor: PIE_COLORS_DIM,
                  borderWidth: 0,
                }],
              }}
            />
          ) : (
            <p className="text-white/35 text-sm">No nutrition data logged yet.</p>
          )}
        </div>
      </Card>

    </div>
  );
};

export default UserHealthProgression;
