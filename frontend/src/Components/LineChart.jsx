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

export default function LineChart({
  data = [],
  dataKey = "speed",
  label,
}) {
  // ❌ No data
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        📉 No data available
      </div>
    );
  }

  // ✅ Filter valid values only
  const filteredData = data.filter(
    (d) => d[dataKey] !== undefined && d[dataKey] !== null
  );

  if (filteredData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        ⚠️ No valid "{dataKey}" data found
      </div>
    );
  }

  // ✅ Labels (time safe format)
  const labels = filteredData.map((d) => {
    if (!d.time) return "-";

    const date = new Date(d.time);
    return isNaN(date) ? d.time : date.toLocaleTimeString();
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: label || dataKey,
        data: filteredData.map((d) => d[dataKey]),

        borderColor: "#2563eb",
        borderWidth: 2,

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
        pointHoverRadius: 5,
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
        display: true,
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
      },
    },

    scales: {
      x: {
        grid: { display: false },
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
      <h2 className="font-semibold mb-3 capitalize">
        📊 {label || dataKey}
      </h2>

      <div className="h-75">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}