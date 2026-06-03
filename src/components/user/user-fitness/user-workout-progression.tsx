import React, { useCallback, useState } from "react";
import { Activity, Flame, Clock3, Dumbbell, Trophy } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import userServices from "@/services/user/user.services";
import { WorkoutProgressResponse } from "@/interface/workout.interface";
import { TIMEFRAME, Timeframe } from "@/constants/fitness.constant";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full bg-white/10 rounded-full h-3 mt-4 overflow-hidden">
    <div 
      className="bg-purple-500 h-3 rounded-full transition-all duration-500 ease-out" 
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

const PIE_COLORS = ['#a855f7', '#4b5563']; // Purple for completed, Gray for skipped

const UserWorkoutProgression = () => {
  const [progressData, setProgressData] = useState<WorkoutProgressResponse | null>(null);
  const [trendType, setTrendType] = useState<Timeframe>(TIMEFRAME.WEEKLY);

  const fetchProgress = useCallback(async () => {
    const response = await userServices.getWorkoutProgress(trendType);
    if (response.success && response.data) {
      setProgressData(response.data);
    }
  }, [trendType]);

  const { refetch } = useFetch(fetchProgress);

  // Auto-refetch when trendType changes
  React.useEffect(() => {
    refetch();
  }, [trendType, refetch]);

  if (!progressData) {
    return (
      <div className="flex justify-center items-center h-96 text-purple-400">
        <Activity className="w-8 h-8 animate-pulse" />
      </div>
    );
  }

  const totalPie = progressData.completedWorkouts + progressData.skippedWorkouts;
  const pieDataValues = totalPie > 0 
    ? [progressData.completedWorkouts, progressData.skippedWorkouts]
    : [1, 0];
  const pieDataLabels = totalPie > 0 ? ['Completed', 'Skipped'] : ['No Data', ''];

  const trendDataSrc = trendType === TIMEFRAME.DAILY ? progressData.dailyCompletionTrend :
                       trendType === TIMEFRAME.WEEKLY ? progressData.weeklyCompletionTrend :
                       progressData.monthlyCompletionTrend;
  
  type TrendData = {
    dayName?: string;
    weekNumber?: number;
    monthName?: string;
    completionRate: number;
  };

  const trendLabels = trendDataSrc.map((d: TrendData) => trendType === TIMEFRAME.DAILY ? d.dayName : trendType === TIMEFRAME.WEEKLY ? `Week ${d.weekNumber}` : d.monthName);
  const trendValues = trendDataSrc.map((d: TrendData) => d.completionRate);

  const muscleLabels = progressData.muscleDistribution.map(d => d.muscleName);
  const muscleValues = progressData.muscleDistribution.map(d => d.count);

  return (
    <div className="max-w-7xl mx-auto text-white w-full px-4 md:px-8 py-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide bg-linear-to-r from-white to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Activity className="w-8 h-8 text-purple-400" />
            Workout Progression
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Track your fitness milestones and analyze your growth over time.
          </p>
        </div>

        {/* Global Timeframe Filter */}
        <div className="flex space-x-2 bg-white/5 p-1 rounded-lg shrink-0 self-start sm:self-center">
          <button 
            onClick={() => setTrendType(TIMEFRAME.DAILY)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${trendType === TIMEFRAME.DAILY ? "bg-purple-600 text-white shadow-md" : "text-white/60 hover:text-white"}`}
          >
            Daily
          </button>
          <button 
            onClick={() => setTrendType(TIMEFRAME.WEEKLY)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${trendType === TIMEFRAME.WEEKLY ? "bg-purple-600 text-white shadow-md" : "text-white/60 hover:text-white"}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setTrendType(TIMEFRAME.MONTHLY)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${trendType === TIMEFRAME.MONTHLY ? "bg-purple-600 text-white shadow-md" : "text-white/60 hover:text-white"}`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* ── Top Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="items-center justify-center text-center">
          <Flame className="w-8 h-8 text-orange-500 mb-2" />
          <p className="text-white/60 text-sm font-medium">Current Streak</p>
          <h2 className="text-2xl font-bold">{progressData.currentStreak} Days</h2>
        </Card>
        
        <Card className="items-center justify-center text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
          <p className="text-white/60 text-sm font-medium">Completion Rate</p>
          <h2 className="text-2xl font-bold">{progressData.completionRate}%</h2>
        </Card>

        <Card className="items-center justify-center text-center">
          <Dumbbell className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-white/60 text-sm font-medium">Workouts Completed</p>
          <h2 className="text-2xl font-bold">{progressData.workoutsCompleted}</h2>
        </Card>

        <Card className="items-center justify-center text-center">
          <Clock3 className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-white/60 text-sm font-medium">Total Training Time</p>
          <h2 className="text-2xl font-bold">{progressData.totalTrainingMinutes} min</h2>
        </Card>
      </div>

      {/* ── Progress Bars ── */}
      <Card>
        <h3 className="text-lg font-bold mb-1">Current Week Progress</h3>
        <div className="flex justify-between text-sm text-white/60">
          <span>Weekly Goal</span>
          <span className="font-bold text-white">{progressData.currentWeekProgress}%</span>
        </div>
        <ProgressBar value={progressData.currentWeekProgress} />
      </Card>

      <Card>
        <h3 className="text-lg font-bold mb-1">Today's Workout Progress</h3>
        <div className="flex justify-between text-sm text-white/60">
          <span>Daily Goal</span>
          <span className="font-bold text-white">{progressData.todayWorkoutProgress}% Completed</span>
        </div>
        <ProgressBar value={progressData.todayWorkoutProgress} />
      </Card>

      {/* ── Combined Trend Chart ── */}
      <Card className="h-[450px] flex flex-col">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h3 className="text-lg font-bold">Completion Trend (%)</h3>
        </div>
        <div className="w-full flex-grow relative">
          <Bar 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { min: 0, max: 100, grid: { color: '#ffffff20' }, ticks: { color: '#ffffff60' } },
                x: { grid: { display: false }, ticks: { color: '#ffffff60' } }
              },
              plugins: { legend: { display: false } }
            }}
            data={{
              labels: trendLabels,
              datasets: [{
                label: 'Completion Rate',
                data: trendValues,
                backgroundColor: '#a855f7',
                borderRadius: 4
              }]
            }}
          />
        </div>
      </Card>

      {/* ── Bottom Row: Pie Chart & Horizontal Bar Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card className="h-80 flex flex-col">
          <h3 className="text-lg font-bold mb-4 shrink-0">Completed vs Skipped</h3>
          <div className="w-full flex-grow relative mx-auto flex items-center justify-center">
            <Pie
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: { color: '#ffffff60' }
                  }
                }
              }}
              data={{
                labels: pieDataLabels,
                datasets: [{
                  data: pieDataValues,
                  backgroundColor: PIE_COLORS,
                  borderWidth: 0
                }]
              }}
            />
          </div>
        </Card>

        <Card className="h-80 flex flex-col">
          <h3 className="text-lg font-bold mb-4 shrink-0">Muscle Group Distribution</h3>
          <div className="w-full flex-grow relative">
            {(progressData.muscleDistribution.length > 1 || (progressData.muscleDistribution.length === 1 && progressData.muscleDistribution[0].muscleName !== 'General')) ? (
              <Bar 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  scales: {
                    y: { grid: { display: false }, ticks: { color: '#ffffff60', autoSkip: false } },
                    x: { grid: { color: '#ffffff20' }, ticks: { color: '#ffffff60' } }
                  },
                  plugins: { 
                    legend: { display: false },
                    tooltip: { enabled: true },
                    title: { display: true, text: 'Exercises by Muscle Group', color: '#ffffff90' }
                  }
                }}
                data={{
                  labels: muscleLabels,
                  datasets: [{
                    label: 'Exercises',
                    data: muscleValues,
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                  }]
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
                No muscle distribution data available.
              </div>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default UserWorkoutProgression;
