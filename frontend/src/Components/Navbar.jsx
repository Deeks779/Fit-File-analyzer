import { NavLink } from "react-router-dom";
import { Home, Upload, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const linkStyle =
    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition";

  const activeStyle = "bg-blue-500 text-white shadow";
  const inactiveStyle = "text-gray-600 hover:bg-gray-100";

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        {/* Logo */}
        <h1 className="text-lg font-bold text-blue-600">
          🏃 Fitness App
        </h1>

        {/* Links */}
        <div className="flex gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`
            }
          >
            <Home size={16} />
            Home
          </NavLink>

          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`
            }
          >
            <Upload size={16} />
            Upload
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`
            }
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
        </div>
      </div>
    </div>
  );
}