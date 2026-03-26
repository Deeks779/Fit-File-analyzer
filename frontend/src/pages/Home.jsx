import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">
        Fitness Analyzer
      </h1>

      <p className="mb-4 text-gray-600">
        Upload your .fit file and analyze your workout
      </p>

      <Link
        to="/upload"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Upload Activity
      </Link>
    </div>
  );
}