"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type UserGrowthData = {
  label: string;
  date: string;
  newUsers: number;
  repeatCustomers: number;
};

interface UserGrowthChartProps {
  data: UserGrowthData[];
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: "New Users",
        data: data.map((item) => item.newUsers),
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Repeat Customers",
        data: data.map((item) => item.repeatCustomers),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
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
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        }
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">User Growth (Last 30 Days)</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default UserGrowthChart;
