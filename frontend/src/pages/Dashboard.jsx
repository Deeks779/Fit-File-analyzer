import { useEffect, useState } from "react";
import LineChart from "../Components/LineChart";
import MapView from "../Components/MapView";
import DataTable from "../Components/DataTable";

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [activity, setActivity] = useState(null);
  const [tab, setTab] = useState("summary");
  const [field, setField] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/activities")
      .then(res => res.json())
      .then(data => setActivities(data));
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    fetch(`http://localhost:5000/api/activity/${selectedId}`)
      .then(res => res.json())
      .then(data => {
        setActivity(data);
        const firstField = Object.keys(data.messages?.record?.[0] || {})[1];
        setField(firstField);
      });
  }, [selectedId]);

  const records = activity?.messages?.record || [];

  const chartData = records
    .filter(r => r[field])
    .map(r => ({
      timestamp: r.timestamp,
      value: r[field]
    }));

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
              <div className="bg-white p-4 rounded-xl shadow">
                <p className="text-gray-500 text-sm">Distance</p>
                <h2 className="text-xl font-semibold">
                  {activity.summary.distance} m
                </h2>
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                <p className="text-gray-500 text-sm">Duration</p>
                <h2 className="text-xl font-semibold">
                  {activity.summary.duration} sec
                </h2>
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                <p className="text-gray-500 text-sm">Avg Heart Rate</p>
                <h2 className="text-xl font-semibold">
                  {activity.summary.avgHeartRate} bpm
                </h2>
              </div>
            </div>
          )}

          {/* CHART */}
          {tab === "charts" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="font-semibold">📊 Chart View</h2>

                <select
                  onChange={(e) => setField(e.target.value)}
                  className="border p-2 rounded-lg"
                >
                  {Object.keys(records[0] || {})
                    .filter((field) =>
                      records.some(r => r[field] !== undefined && r[field] !== null && r[field] !== 0)
                    )
                    .map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                </select>
              </div>

              <LineChart dataPoints={chartData} label={field} color="blue" />
            </div>
          )}

          {/* MAP */}
          {tab === "map" && (
            <div className="bg-white p-6 rounded-xl shadow">
              {records.some(r => r.position_lat) ? (
                <MapView data={records} />
              ) : (
                <p className="text-gray-500 text-center">
                  🗺️ No GPS data available
                </p>
              )}
            </div>
          )}

          {/* TABLE */}
          {tab === "data" && (
            <div className="bg-white p-6 rounded-xl shadow overflow-auto">
              <DataTable data={records} />
            </div>
          )}

          {/* DEVICE */}
          {tab === "device" && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow overflow-auto">
                <h3 className="font-semibold mb-2">📱 Device Info</h3>
                <pre className="text-xs">
                  {JSON.stringify(activity.messages.device_info, null, 2)}
                </pre>
              </div>

              <div className="bg-white p-4 rounded-xl shadow overflow-auto">
                <h3 className="font-semibold mb-2">👤 User Profile</h3>
                <pre className="text-xs">
                  {JSON.stringify(activity.messages.user_profile, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}