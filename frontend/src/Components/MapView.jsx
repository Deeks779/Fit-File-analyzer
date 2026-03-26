import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Auto fit bounds
function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [30, 30] });
    }
  }, [positions, map]);

  return null;
}

export default function MapView({ data }) {
  const positions = data
    .filter((d) => d.lat && d.lon)
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
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Auto fit */}
          <FitBounds positions={positions} />

          {/* Route */}
          <Polyline
            positions={positions}
            pathOptions={{
              color: "#2563eb",
              weight: 4,
              opacity: 0.8,
            }}
          />

          {/* Start Marker */}
          <Marker position={positions[0]} />

          {/* End Marker */}
          <Marker position={positions[positions.length - 1]} />
        </MapContainer>
      </div>

      {/* Info */}
      <div className="flex justify-between mt-3 text-sm text-gray-600">
        <span>Start 🟢</span>
        <span>End 🔴</span>
      </div>
    </div>
  );
}