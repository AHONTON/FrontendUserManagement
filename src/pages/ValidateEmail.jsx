import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// Bouton générique (équivalent Shadcn UI)
const Button = ({
  children,
  onClick,
  className = "",
  variant = "default",
  ...props
}) => {
  const baseStyle =
    "px-4 py-3 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500";
  const variants = {
    default:
      "bg-cyan-500 hover:bg-cyan-600 text-white shadow-cyan-500/30 shadow-lg",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function ValidateEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Récupération du token depuis l’URL
  const token = new URLSearchParams(location.search).get("token");

  const handleValidation = async () => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Token de validation manquant");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Erreur lors de la validation");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Erreur de connexion au serveur");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1929] via-[#1a2f45] to-[#0d2137] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid w-full max-w-6xl overflow-hidden shadow-2xl lg:grid-cols-2 rounded-2xl"
      >
        {/* 🔹 Partie gauche - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative bg-gradient-to-br from-[#0f2744] to-[#1a3a5c] p-12 flex flex-col justify-center items-center text-white hidden lg:flex"
        >
          <div className="absolute inset-0 bg-[url('/abstract-tech-pattern-dark-blue.jpg')] opacity-10 bg-cover bg-center" />

          <div className="relative z-10 space-y-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center justify-center w-24 h-24 border rounded-full bg-cyan-500/20 backdrop-blur-sm border-cyan-400/30"
            >
              <Mail className="w-12 h-12 text-cyan-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-4xl font-bold"
            >
              VALIDATION EMAIL
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="max-w-md text-lg text-cyan-100/80"
            >
              Validez votre adresse email pour accéder à l’espace administrateur
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-sm text-cyan-200/60"
            >
              © 2025
            </motion.div>
          </div>
        </motion.div>

        {/* 🔹 Partie droite - Validation */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col justify-center p-8 bg-white md:p-12"
        >
          <div className="w-full max-w-md mx-auto space-y-8">
            {/* Header Mobile */}
            <div className="mb-8 text-center lg:hidden">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-cyan-500/10">
                <Mail className="w-8 h-8 text-cyan-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Validation Email
              </h2>
            </div>

            {status === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 text-center"
              >
                <h2 className="text-3xl font-bold text-gray-900">
                  Validez votre email
                </h2>
                <p className="text-black">
                  Cliquez sur le bouton ci-dessous pour confirmer votre adresse
                  email et activer votre compte administrateur.
                </p>
                <Button onClick={handleValidation} className="w-full h-12">
                  Valider mon email
                </Button>
              </motion.div>
            )}

            {status === "loading" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10">
                  <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Validation en cours...
                </h3>
                <p className="text-black">
                  Veuillez patienter pendant que nous validons votre email
                </p>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Email validé avec succès !
                </h3>
                <p className="text-black">
                  Redirection vers la page de connexion...
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-black">
                  Erreur de validation
                </h3>
                <p className="font-medium text-red-600">{errorMessage}</p>
                <div className="space-y-3">
                  <Button onClick={handleValidation} className="w-full h-12">
                    Réessayer
                  </Button>
                  <Button
                    onClick={() => navigate("/login")}
                    variant="outline"
                    className="w-full h-12"
                  >
                    Retour à la connexion
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
