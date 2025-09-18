// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Home, Users, User, HelpCircle, LogOut } from "lucide-react";

const defaultMenu = [
  { label: "Accueil", icon: <Home className="w-5 h-5" />, path: "/dashboard" },
  { label: "Utilisateurs", icon: <Users className="w-5 h-5" />, path: "/users" },
  { label: "Mon compte", icon: <User className="w-5 h-5" />, path: "/profile" },
  { label: "Aide/Support", icon: <HelpCircle className="w-5 h-5" />, path: "/support" },
  { label: "Déconnexion", icon: <LogOut className="w-5 h-5" />, path: "/logout", isLogout: true },
];

const DashboardLayout = ({ menuItems = defaultMenu, initialPath = "/dashboard" }) => {
  const [activePath, setActivePath] = useState(initialPath);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path, item) => {
    setActivePath(path);
    if (item.isLogout) {
      console.log("Déconnexion...");
      return;
    }
    navigate(path);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        activePath={activePath}
        collapsed={collapsed}
        onNavigate={handleNavigate}
      />

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />

        {/* Pages */}
        <main className="flex-1 p-6 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
