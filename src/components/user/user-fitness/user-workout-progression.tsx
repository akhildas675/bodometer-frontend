import React, { useCallback, useEffect, useState } from "react";
import {
  Activity,
  Flame,
  Clock3,
  Dumbbell,
  Trophy,
  TrendingUp,
  Target
} from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import userServices from "@/services/user/user.services";
import { WorkoutProgressResponse } from "@/interface/workout.interface";
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
  WORKOUT_TIME_TABS,
  baseScales,
  baseLegend,
  gridColor,
  tickColor,
  PIE_COLORS,
  PIE_COLORS_DIM,
  lineDataset,
  barDataset
} from "../shared/dashboard-components";

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

const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full bg-white/10 rounded-full h-3 mt-4 overflow-hidden">
    <div 
      className="bg-purple-500 h-3 rounded-full transition-all duration-500 ease-out" 
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

const UserWorkoutProgression = () => {
  const [data, setData] = useState<WorkoutProgressResponse | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>(TIMEFRAME.WEEKLY);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userServices.getWorkoutProgress(timeframe);
      if (res.success && res.data) setData(res.data);
    } catch (e) {
      console.error("Workout progress fetch failed", e);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  const { refetch } = useFetch(fetchProgress);
  useEffect(() => { refetch(); }, [timeframe, refetch]);

  const currentTab = WORKOUT_TIME_TABS.find(t => t.value === timeframe)!;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-purple-400">
        <Activity className="w-10 h-10 animate-pulse" />
      </div>
    );
  }

  // ── Derived chart arrays ─────────────────────────────────────────────────
  const trendLabels = data?.trendData.map(d => d.label) ?? [];
  const trendValues = data?.trendData.map(d => d.completionRate) ?? [];

  const muscleLabels = data?.muscleDistribution.map(d => `${d.muscleName} (${d.percentage}%)`) ?? [];
  const muscleValues = data?.muscleDistribution.map(d => d.count) ?? [];

  const pieDataValues = data?.pieChart?.values ?? [1, 0];
  const pieDataLabels = data?.pieChart?.labels ?? ['No Data', ''];
  const STATUS_PIE_COLORS = ['#a855f7', '#4b5563'];

  return (
    <div className="max-w-7xl mx-auto text-white w-full px-4 md:px-8 py-6 space-y-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              Workout Progress
            </span>
          </h1>
          <p className="text-white/45 text-sm mt-1">
            Track your fitness milestones and analyze your growth — {currentTab.sub}
          </p>
        </div>

        {/* Timeframe tabs */}
        <div className="flex space-x-1 bg-white/5 border border-white/10 p-1 rounded-xl shrink-0">
          {WORKOUT_TIME_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setTimeframe(tab.value)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                timeframe === tab.value
                  ? "bg-purple-600 text-white shadow"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<Flame className="w-5 h-5 text-orange-500" />} iconClass="bg-orange-500/10" label="Current Streak" value={`${data?.currentStreak ?? 0}`} sub="Days" />
        <StatCard icon={<Trophy className="w-5 h-5 text-yellow-500" />} iconClass="bg-yellow-500/10" label="Completion Rate" value={`${data?.completionRate ?? 0}%`} sub="overall" />
        <StatCard icon={<Dumbbell className="w-5 h-5 text-blue-400" />} iconClass="bg-blue-400/10" label="Workouts Completed" value={`${data?.workoutsCompleted ?? 0}`} sub="sessions" />
        <StatCard icon={<Clock3 className="w-5 h-5 text-green-400" />} iconClass="bg-green-400/10" label="Training Time" value={`${data?.totalTrainingMinutes ?? 0}`} sub="minutes" />
      </div>

      {/* ── Progress Bar ── */}
      <Card>
        <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          {data?.progressBar?.title ?? "Workout Progress"}
        </h3>
        <div className="flex justify-between text-sm text-white/60">
          <span>{data?.progressBar?.goalLabel ?? "Goal"}</span>
          <span className="font-bold text-white">
            {data?.progressBar?.valueLabel ?? "0%"}
          </span>
        </div>
        <ProgressBar value={data?.progressBar?.value ?? 0} />
      </Card>

      {/* ── Line: Completion Trend ── */}
      <ChartCard title="Completion Trend (%)" height="h-64">
        <Line
          options={{ responsive: true, maintainAspectRatio: false, scales: { ...baseScales, y: { min: 0, max: 100, grid: { color: gridColor }, ticks: { color: tickColor } } }, plugins: { legend: baseLegend } }}
          data={{
            labels: trendLabels,
            datasets: [lineDataset("Completion Rate (%)", trendValues, "rgb(168,85,247)")], // Purple
          }}
        />
      </ChartCard>

      {/* ── Bottom Row: Pie Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Completed vs Skipped */}
        <Card className="min-h-[28rem]">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Completed vs Skipped</h3>
          <div className="w-full min-h-[22rem] relative flex items-center justify-center">
            <Pie
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: 'bottom', labels: { color: tickColor, padding: 20 } }
                }
              }}
              data={{
                labels: pieDataLabels,
                datasets: [{
                  data: pieDataValues,
                  backgroundColor: STATUS_PIE_COLORS,
                  borderWidth: 0
                }]
              }}
            />
          </div>
        </Card>

        {/* Muscle Group Distribution */}
        <Card className="min-h-[28rem]">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Muscle Group Distribution</h3>
          <div className="w-full min-h-[22rem] relative flex items-center justify-center">
            {muscleValues.length > 0 && (muscleValues.length > 1 || muscleLabels[0]?.indexOf('General') === -1) ? (
              <Pie
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: true, position: 'bottom', labels: { color: tickColor, padding: 20 } },
                    tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} exercises` } }
                  }
                }}
                data={{
                  labels: muscleLabels,
                  datasets: [{
                    data: muscleValues,
                    backgroundColor: PIE_COLORS,
                    hoverBackgroundColor: PIE_COLORS_DIM,
                    borderWidth: 0
                  }]
                }}
              />
            ) : (
              <p className="text-white/35 text-sm">No specific muscle data available yet.</p>
            )}
          </div>
        </Card>
        
      </div>

    </div>
  );
};

export default UserWorkoutProgression;
