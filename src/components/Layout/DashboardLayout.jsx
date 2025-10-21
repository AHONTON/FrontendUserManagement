// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import { FiHome, FiUsers, FiUser, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Layout.css";

const defaultMenu = [
  { label: "Accueil", icon: <FiHome className="w-5 h-5" />, path: "/dashboard" },
  { label: "Utilisateurs", icon: <FiUsers className="w-5 h-5" />, path: "/users" },
  { label: "Mon compte", icon: <FiUser className="w-5 h-5" />, path: "/profile" },
  { label: "Aide/Support", icon: <FiHelpCircle className="w-5 h-5" />, path: "/support" },
  { label: "Déconnexion", icon: <FiLogOut className="w-5 h-5" />, path: "/logout", isLogout: true },
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
    <div className="app-grid">
      <Sidebar
        menuItems={menuItems}
        activePath={activePath}
        collapsed={collapsed}
        onNavigate={handleNavigate}
      />

      <div className="main-area">
        <Header
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
