import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Pendant le chargement (vérification du user), on peut afficher un loader
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-medium text-blue-600">
        Vérification de la session...
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté → redirection vers /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, on rend le composant demandé (ex : Dashboard)
  return children;
};

export default PrivateRoute;
