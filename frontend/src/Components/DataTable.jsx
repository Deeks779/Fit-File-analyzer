import { useState } from "react";

export default function DataTable({ data = [] }) {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        📄 No data available
      </div>
    );
  }

  const cols = Object.keys(data[0]);
  const totalPages = Math.ceil(data.length / pageSize);

  const currentData = data.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="font-semibold mb-4">📋 Data Table</h2>

      <div className="overflow-auto max-h-100 border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {cols.map((c) => (
                <th key={c} className="px-3 py-2 font-medium text-gray-600">
                  {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentData.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                {cols.map((c) => (
                  <td key={c} className="px-3 py-2 text-gray-700">
                    {c === "time"
                      ? new Date(row[c]).toLocaleTimeString()
                      : String(row[c] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Page {page + 1} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className={`px-3 py-1 rounded-lg text-sm ${
              page === 0
                ? "bg-gray-200 text-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            ← Prev
          </button>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1}
            className={`px-3 py-1 rounded-lg text-sm ${
              page >= totalPages - 1
                ? "bg-gray-200 text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}