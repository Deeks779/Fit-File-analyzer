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

export default function LineChart({ data = [], dataKey = "speed", label }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        📉 No data available
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) =>
      new Date(d.time).toLocaleTimeString()
    ),
    datasets: [
      {
        label: label || dataKey,
        data: data.map((d) => d[dataKey]),
        borderColor: "#2563eb",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(37,99,235,0.4)");
          gradient.addColorStop(1, "rgba(37,99,235,0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="font-semibold mb-3">📊 {label || dataKey}</h2>

      <div className="h-75">
        <Line data={chartData} />
      </div>
    </div>
  );
}