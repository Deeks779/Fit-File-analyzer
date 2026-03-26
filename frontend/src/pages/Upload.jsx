import { useState, useRef } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const upload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      setMsg("✅ Uploaded successfully");

      // Clear file input
      setFile(null);
      fileInputRef.current.value = "";

      // Hide message after 5 sec
      setTimeout(() => {
        setMsg("");
      }, 5000);
    } catch (err) {
      setMsg("❌ Upload failed");

      setTimeout(() => {
        setMsg("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[400px] text-center">
        <h2 className="text-xl font-semibold mb-4">Upload FIT File</h2>

        {/* File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full border p-2 rounded-lg mb-3"
        />

        {/* File Name */}
        {file && (
          <p className="text-sm text-gray-600 mb-3">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}

        {/* Upload Button */}
        <button
          onClick={upload}
          disabled={!file || loading}
          className={`w-full py-2 rounded-lg text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {/* Message */}
        {msg && (
          <p className="mt-4 text-sm font-medium text-green-600">{msg}</p>
        )}
      </div>
    </div>
  );
}