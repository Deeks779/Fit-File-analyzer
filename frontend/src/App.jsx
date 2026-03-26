import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Navbar from "./Components/Navbar"
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;