import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Création du contexte d'authentification
const AuthContext = createContext();

// Fournisseur d'authentification global
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si un utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          console.log("🔍 Token trouvé, vérification de l'authentification...");
          // Optionnel : vérifier la validité du token avec l'API
          const response = await axios.get(
            "http://127.0.0.1:8000/api/admin/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("✅ Utilisateur authentifié:", response.data);
          setUser(response.data);
        }
      } catch (error) {
        console.error("❌ Erreur de vérification auth:", error);
        localStorage.removeItem("auth_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Connexion utilisateur (POST vers ton API backend)
  const login = async ({ email, password }) => {
    try {
      console.log("🔐 Tentative de connexion pour:", email);
      const res = await axios.post("http://127.0.0.1:8000/api/admin/login", {
        email,
        password,
      });

      console.log("✅ Connexion réussie:", res.data);
      setUser(res.data.user);

      // Stocker le token si fourni
      if (res.data.token) {
        localStorage.setItem("auth_token", res.data.token);
        console.log("💾 Token stocké");
      }

      return res.data;
    } catch (error) {
      console.error("❌ Erreur de connexion:", error);
      throw error;
    }
  };

  // Inscription directe avec mise à jour du contexte
  const register = (userData, token) => {
    console.log("📝 Inscription avec:", userData);
    setUser(userData);
    if (token) {
      localStorage.setItem("auth_token", token);
      console.log("💾 Token d'inscription stocké");
    }
  };

  // Déconnexion utilisateur
  const logout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        console.log("🚪 Déconnexion...");
        await axios.post(
          "http://127.0.0.1:8000/api/admin/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("auth_token");
      console.log("✅ Déconnexion locale terminée");
    }
  };

  const value = {
    user,
    setUser, // ← AJOUTÉ : Pour pouvoir modifier directement l'utilisateur
    login,
    register, // ← AJOUTÉ : Méthode spécifique pour l'inscription
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour accéder au contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
