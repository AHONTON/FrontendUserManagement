import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔍 Vérification automatique de l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Token trouvé, vérification de l'authentification...");

        const response = await axios.get("http://127.0.0.1:5000/api/admin/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("✅ Utilisateur authentifié:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("❌ Erreur de vérification auth:", error);
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔐 Connexion utilisateur
  const login = async ({ email, password, remember }) => {
    try {
      console.log("🔐 Tentative de connexion pour:", email);
      const res = await axios.post("http://127.0.0.1:5000/api/admin/login", {
        email,
        password,
      });

      console.log("✅ Connexion réussie:", res.data);
      setUser(res.data.admin || res.data.user);

      if (res.data.token) {
        if (remember) localStorage.setItem("auth_token", res.data.token);
        else sessionStorage.setItem("auth_token", res.data.token);

        console.log("💾 Token stocké avec succès");
      }

      return res.data;
    } catch (error) {
      console.error("❌ Erreur de connexion:", error);
      throw error;
    }
  };

  // 📝 Inscription utilisateur
  const register = (userData, token, remember = true) => {
    console.log("📝 Inscription avec:", userData);
    setUser(userData);

    if (token) {
      if (remember) localStorage.setItem("auth_token", token);
      else sessionStorage.setItem("auth_token", token);

      console.log("💾 Token d'inscription stocké");
    }
  };

  // 🚪 Déconnexion
  const logout = async () => {
    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");

      if (token) {
        console.log("🚪 Déconnexion...");
        await axios.post(
          "http://127.0.0.1:5000/api/admin/logout",
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
      console.error("❌ Erreur lors de la déconnexion:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
      console.log("✅ Déconnexion locale terminée");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
