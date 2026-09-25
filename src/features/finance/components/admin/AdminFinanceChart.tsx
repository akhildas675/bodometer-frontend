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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { AdminChartPoint, ChartPeriod } from "../../types/finance.types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface Props {
  data: AdminChartPoint[];
  period: ChartPeriod;
  onPeriodChange: (p: ChartPeriod) => void;
  loading: boolean;
}

export const AdminFinanceChart: React.FC<Props> = ({
  data,
  period,
  onPeriodChange,
  loading,
}) => {
  const labels = data.map((d) => d.label);
  const grossRevenue = data.map((d) => d.grossRevenue);
  const trainerEarnings = data.map((d) => d.trainerEarnings);
  const platformEarnings = data.map((d) => d.platformEarnings);

  const chartData = {
    labels: labels.length > 0 ? labels : ["No data"],
    datasets: [
      {
        label: "Gross Volume",
        data: grossRevenue.length > 0 ? grossRevenue : [0],
        borderColor: "#a855f7",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
      },
      {
        label: "Trainer Share (70%)",
        data: trainerEarnings.length > 0 ? trainerEarnings : [0],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
      },
      {
        label: "Platform Cut (30%)",
        data: platformEarnings.length > 0 ? platformEarnings : [0],
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#a3a3a3",
          font: { size: 11 },
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: "#171717",
        titleColor: "#e5e5e5",
        borderColor: "#262626",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: { dataset: { label?: string }; parsed: { y: number | bigint | null } }) =>
            ` ${context.dataset.label}: ₹${(context.parsed.y ?? 0).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.04)" },
        ticks: { color: "#737373", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.04)" },
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
          <h3 className="text-base font-semibold text-white">
            Platform Financial Trends
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Gross revenue comparison against trainer disbursement and platform retainage
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

      {/* Chart Container */}
      <div className="h-64 w-full relative">
        {loading && (
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
