import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Documents from "../components/Documents";
import Admin from "../components/Admin";
import Users from "../components/Users";
import Category from "../components/Category";
import ProjectCodes from "../components/ProjectCodes";
import Profile from "../components/Profile";

function Home() {
  const [activeItem, setActiveItem] = useState("home");

  // Render content based on active menu item
  const renderContent = () => {
    switch (activeItem) {
      case "home":
        return <Documents />;
      case "admin":
        return <Admin />;
      case "users":
        return <Users />;
      case "category":
        return <Category />;
      case "projectcode":
        return <ProjectCodes />;
      case "profile":
        return <Profile />;
      default:
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Home;
