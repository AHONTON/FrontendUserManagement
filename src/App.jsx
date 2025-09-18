import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/contexts/ThemeContext";
import Layout from "./components/Layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import ProfilePage from "./pages/ProfilePage";
import SupportPage from "./pages/SupportPage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Redirection par défaut vers le dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          {/* Layout persistant avec Header + Sidebar */}
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="support" element={<SupportPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
