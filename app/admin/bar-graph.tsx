"use client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ChartData,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement);

type RevenueData = {
  label: string;
  date: string;
  revenue: number;
  dmc: number;
  spf: number;
  orders: number;
  paidOrders: number;
  unpaidOrders: number;
  refunds: number;
};

type TimeRange = "7days" | "30days" | "3months" | "year";

interface RevenueGraphProps {
  data: RevenueData[];
  onRangeChange: (range: TimeRange) => void;
  currentRange: TimeRange;
}

const RevenueGraph: React.FC<RevenueGraphProps> = ({ data, onRangeChange, currentRange }) => {
  const labels = data.map((item) => item.label);

  const chartData: ChartData<'bar' | 'line'> = {
    labels: labels,
    datasets: [
      {
        type: 'bar' as const,
        label: "Revenue",
        data: data.map((item) => item.revenue),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'bar' as const,
        label: "DMC",
        data: data.map((item) => item.dmc),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'bar' as const,
        label: "SPF",
        data: data.map((item) => item.spf),
        backgroundColor: "rgba(168, 85, 247, 0.6)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'bar' as const,
        label: "Refunds",
        data: data.map((item) => -item.refunds),
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: "Orders",
        data: data.map((item) => item.orders),
        borderColor: "rgba(234, 179, 8, 1)",
        backgroundColor: "rgba(234, 179, 8, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (label.includes('Orders')) {
                label += context.parsed.y;
              } else {
                label += '₦' + Math.abs(context.parsed.y).toLocaleString();
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenue (₦)',
        },
        ticks: {
          callback: function(value: any) {
            return '₦' + value.toLocaleString();
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Number of Orders',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Revenue & Orders Breakdown</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onRangeChange("7days")}
            className={`px-3 py-1 rounded text-sm ${
              currentRange === "7days"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => onRangeChange("30days")}
            className={`px-3 py-1 rounded text-sm ${
              currentRange === "30days"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => onRangeChange("3months")}
            className={`px-3 py-1 rounded text-sm ${
              currentRange === "3months"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            3 Months
          </button>
          <button
            onClick={() => onRangeChange("year")}
            className={`px-3 py-1 rounded text-sm ${
              currentRange === "year"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            Year
          </button>
        </div>
      </div>
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
};

export default RevenueGraph;
