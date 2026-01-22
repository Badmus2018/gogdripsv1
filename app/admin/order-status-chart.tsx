"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type OrderStatusData = {
  label: string;
  date: string;
  pending: number;
  dispatched: number;
  delivered: number;
  cancelled: number;
};

interface OrderStatusChartProps {
  data: OrderStatusData[];
}

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: "Delivered",
        data: data.map((item) => item.delivered),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
      {
        label: "Dispatched",
        data: data.map((item) => item.dispatched),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Pending",
        data: data.map((item) => item.pending),
        backgroundColor: "rgba(234, 179, 8, 0.6)",
        borderColor: "rgba(234, 179, 8, 1)",
        borderWidth: 1,
      },
      {
        label: "Cancelled",
        data: data.map((item) => item.cancelled),
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        }
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Order Status Timeline (Last 30 Days)</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default OrderStatusChart;
