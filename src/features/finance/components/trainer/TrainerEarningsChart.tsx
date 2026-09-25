import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TrendingUp } from "lucide-react";
import { ChartPeriod, TrainerChartPoint } from "../../types/finance.types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface Props {
  data: TrainerChartPoint[];
  period: ChartPeriod;
  onPeriodChange: (p: ChartPeriod) => void;
  loading: boolean;
}

export const TrainerEarningsChart: React.FC<Props> = ({
  data,
  period,
  onPeriodChange,
  loading,
}) => {
  const labels = data.map((d) => d.label);
  const earnings = data.map((d) => d.earnings);

  const totalInPeriod = earnings.reduce((sum, val) => sum + val, 0);

  const chartData = {
    labels: labels.length > 0 ? labels : ["No data"],
    datasets: [
      {
        label: "Earnings (₹)",
        data: earnings.length > 0 ? earnings : [0],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.08)",
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#052e16",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#171717",
        titleColor: "#e5e5e5",
        bodyColor: "#10b981",
        borderColor: "#262626",
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        callbacks: {
          label: (context: { parsed: { y: number | bigint | null } }) =>
            ` Earnings: ₹${(context.parsed.y ?? 0).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.04)",
        },
        ticks: {
          color: "#737373",
          font: { size: 11 },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.04)",
        },
        ticks: {
          color: "#737373",
          font: { size: 11 },
          callback: (value: string | number) => `₹${Number(value).toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 backdrop-blur-sm mb-8">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">
              Revenue Progression
            </h3>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} />
              ₹{totalInPeriod.toLocaleString("en-IN")} total
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Your earned session share over time
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 self-start sm:self-auto">
          {(["daily", "weekly", "monthly"] as ChartPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                period === p
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="h-64 w-full relative">
        {loading && (
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
