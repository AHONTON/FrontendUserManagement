import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/contexts/ThemeContext";
import { AuthProvider } from "./components/contexts/AuthContext";
import PrivateRoute from "./components/contexts/PrivateRoute";

import Layout from "./components/Layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import ProfilePage from "./pages/ProfilePage";
import SupportPage from "./pages/SupportPage";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import ValidateEmail from "./pages/ValidateEmail";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Pages publiques */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/validate" element={<ValidateEmail />} />

            {/* Routes protégées via PrivateRoute */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              {/* Redirection par défaut vers dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />

              {/* Pages protégées */}
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="support" element={<SupportPage />} />
            </Route>

            {/* Catch-all pour routes inconnues */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
