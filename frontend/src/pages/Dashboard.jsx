import { useEffect, useState } from "react";
import LineChart from "../Components/LineChart";
import MapView from "../Components/MapView";
import DataTable from "../Components/DataTable";

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [activity, setActivity] = useState(null);
  const [tab, setTab] = useState("summary");
  const [field, setField] = useState("speed");

  // Fetch all activities
  useEffect(() => {
    fetch("http://localhost:5000/api/activities")
      .then(res => res.json())
      .then(data => setActivities(data));
  }, []);

  // Fetch selected activity
  useEffect(() => {
    if (!selectedId) return;

    fetch(`http://localhost:5000/api/activity/${selectedId}`)
      .then(res => res.json())
      .then(data => {
        setActivity(data);

        // auto pick first numeric field
        const firstField =
          Object.keys(data.graphData?.[0] || {}).find(
            k => k !== "time" && typeof data.graphData[0][k] === "number"
          ) || "speed";

        setField(firstField);
      });
  }, [selectedId]);

  const graphData = activity?.graphData || [];
  const tableData = activity?.tableData || [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">🏃 Fitness Dashboard</h1>

        <select
          onChange={(e) => setSelectedId(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option>Select Activity</option>
          {activities.map(a => (
            <option key={a._id} value={a._id}>
              {a.fileName}
            </option>
          ))}
        </select>
      </div>

      {!activity && (
        <div className="text-center text-gray-500 mt-20">
          📂 Select an activity to view details
        </div>
      )}

      {activity && (
        <>
          {/* TABS */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {["summary","charts","map","data","device"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full text-sm capitalize transition 
                  ${tab === t
                    ? "bg-blue-500 text-white shadow"
                    : "bg-white text-gray-600 hover:bg-gray-200"}
                `}
              >
                {t}
              </button>
            ))}
          </div>

          {/* SUMMARY */}
          {tab === "summary" && (
            <div className="grid md:grid-cols-3 gap-4">
              <Card title="Distance" value={`${activity.summary.distance} m`} />
              <Card title="Duration" value={`${activity.summary.duration} sec`} />
              <Card title="Avg Speed" value={`${activity.summary.avgSpeed?.toFixed(2)} m/s`} />
              <Card title="Max Speed" value={`${activity.summary.maxSpeed?.toFixed(2)} m/s`} />
              <Card title="Calories" value={`${activity.summary.calories}`} />
              <Card title="Sport" value={activity.summary.sport} />
            </div>
          )}

          {/* CHART */}
          {tab === "charts" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="font-semibold">📊 Chart View</h2>

                <select
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="border p-2 rounded-lg"
                >
                  {Object.keys(graphData[0] || {})
                    .filter(k => k !== "time")
                    .map(k => (
                      <option key={k}>{k}</option>
                    ))}
                </select>
              </div>

              <LineChart
                data={graphData}
                dataKey={field}
                label={field}
              />
            </div>
          )}

          {/* MAP */}
          {tab === "map" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <MapView data={graphData} />
            </div>
          )}

          {/* TABLE */}
          {tab === "data" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <DataTable data={tableData} />
            </div>
          )}

          {/* DEVICE */}
          {tab === "device" && (
            <div className="grid md:grid-cols-2 gap-4">
              <Box title="📱 Device Info" data={activity.device} />
              <Box title="📊 Session Info" data={activity.session} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 🔹 Reusable components
function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-semibold">{value ?? "-"}</h2>
    </div>
  );
}

function Box({ title, data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow overflow-auto">
      <h3 className="font-semibold mb-2">{title}</h3>
      <pre className="text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}