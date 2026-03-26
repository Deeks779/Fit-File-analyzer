import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function LineChart({ dataPoints, label, color }) {
  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        📉 No data available
      </div>
    );
  }

  const data = {
    labels: dataPoints.map((d) =>
      new Date(d.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: label,
        data: dataPoints.map((d) => d.value),
        borderColor: color,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, "rgba(37, 99, 235, 0.4)"); // blue with opacity
            gradient.addColorStop(1, "rgba(37, 99, 235, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 6,
          color: "#6b7280",
        },
      },
      y: {
        grid: {
          color: "#e5e7eb",
        },
        ticks: {
          color: "#6b7280",
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <div className="mb-3 flex justify-between items-center">
        <h2 className="font-semibold">📊 {label}</h2>
      </div>

      <div className="h-75">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}