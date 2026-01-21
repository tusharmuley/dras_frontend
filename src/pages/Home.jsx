import { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Documents from "../components/Documents";
import Admin from "../components/Admin";
import Employee from "../components/Employee";
import Category from "../components/Category";
import ProjectCodes from "../components/ProjectCodes";
import Profile from "../components/Profile";

function Home() {
  const [activeItem, setActiveItem] = useState("home");

  // Render content based on active menu item - memoized to prevent unnecessary re-renders
  const renderContent = useMemo(() => {
    switch (activeItem) {
      case "home":
        return <Documents key="home" />;
      case "admin":
        return <Admin key="admin" />;
      case "employee":
        return <Employee key="employee" />;
      case "category":
        return <Category key="category" />;
      case "projectcode":
        return <ProjectCodes key="projectcode" />;
      case "profile":
        return <Profile key="profile" />;
      default:
        return (
          <div key="notfound">
            <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
          </div>
        );
    }
  }, [activeItem]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent}
        </div>
      </div>
    </div>
  );
}

export default Home;
