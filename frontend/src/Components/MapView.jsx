import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import { useEffect } from "react";

// ✅ ADD THIS
function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [30, 30] });
    }
  }, [positions, map]);

  return null;
}

export default function MapView({ data = [] }) {
  const positions = data
    .filter((d) => d.lat != null && d.lon != null)
    .map((d) => [d.lat, d.lon]);

  if (positions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        🗺️ No GPS data available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="font-semibold mb-3">🗺️ Activity Route</h2>

      <div className="rounded-xl overflow-hidden">
        <MapContainer
          center={positions[0]}
          zoom={13}
          style={{ height: "450px", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ✅ NOW WORKS */}
          <FitBounds positions={positions} />

          <Polyline positions={positions} pathOptions={{ color: "#2563eb" }} />

          <Marker position={positions[0]} />
          <Marker position={positions[positions.length - 1]} />
        </MapContainer>
      </div>
    </div>
  );
}