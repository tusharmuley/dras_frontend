import { useState } from "react";
import { getUser, removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Sidebar({ activeItem, setActiveItem }) {
  const user = getUser();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  // Define menu items based on role
  const getMenuItems = () => {
    const role = user?.role?.toLowerCase();
    
    const allItems = [
      { id: "home", label: "Home", icon: "🏠" },
      { id: "admin", label: "Admin", icon: "👤" },
      { id: "users", label: "Users", icon: "👥" },
      { id: "category", label: "Category", icon: "📁" },
      { id: "projectcode", label: "Project Code", icon: "🔑" },
      { id: "profile", label: "Profile", icon: "⚙️" },
    ];

    if (role === "super_admin") {
      // Super admin: full access (documents, admin, users, category, project codes, profile)
      return allItems;
    } else if (role === "admin") {
      // Admin: home, users, category, profile (NO project codes, admin panel)
      return allItems.filter(item => 
        ["home", "users", "category", "profile"].includes(item.id)
      );
    } else if (role === "employee") {
      // Employee: only home and profile
      return allItems.filter(item => 
        ["home", "profile"].includes(item.id)
      );
    }
    
    // Default: only home and profile
    return allItems.filter(item => 
      ["home", "profile"].includes(item.id)
    );
  };

  const menuItems = getMenuItems();
  const userDisplayName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.username || "User";

  return (
    <div className={`bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-white">DCS</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {userDisplayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {userDisplayName}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.role || "User"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  if (activeItem !== item.id) {
                    setActiveItem(item.id);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeItem === item.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                title={isCollapsed ? item.label : ""}
                disabled={activeItem === item.id}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
          title={isCollapsed ? "Logout" : ""}
        >
          <span className="text-xl">🚪</span>
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

