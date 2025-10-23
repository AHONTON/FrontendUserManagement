import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Check, Eye, EyeOff } from "lucide-react";

const API_BASE =
  (import.meta?.env?.VITE_API_URL && String(import.meta.env.VITE_API_URL)) ||
  "/api";
const API_URL = `${API_BASE.replace(/\/$/, "")}/admin/login`;

// Animation variants (similaires à register.jsx)
const containerVariants = {
  hidden: { opacity: 0, scale: 0.995 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.04, when: "beforeChildren" },
  },
};
const leftVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
};
const formVariants = {
  hidden: { x: 30, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
};
const fieldVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};
const btnTap = { scale: 0.985 };

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "L'email est requis";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email invalide";
    if (!form.password || form.password.length < 6)
      e.password = "Le mot de passe doit contenir au moins 6 caractères";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (_) {}

      if (!res.ok) {
        setServerError(data?.message || `Erreur serveur (${res.status})`);
        setLoading(false);
        return;
      }

      // si token renvoyé, stocker selon remember
      if (data?.token) {
        try {
          if (form.remember) localStorage.setItem("token", data.token);
          else sessionStorage.setItem("token", data.token);
        } catch (_) {}
      }

      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setServerError("Impossible de contacter le serveur");
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-sky-900 to-sky-700"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div
        className="flex flex-col items-stretch w-full max-w-4xl mx-4 overflow-hidden shadow-xl md:mx-0 md:flex-row rounded-xl"
        style={{ minHeight: 480 }}
      >
        <motion.div
          variants={leftVariants}
          className="relative flex items-center justify-center w-full text-center bg-black md:w-5/12 lg:w-6/12"
        >
          <img
            src="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1400&q=80"
            alt="illustration"
            className="absolute inset-0 object-cover object-center w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/65 to-sky-700/30" />
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full gap-4 p-6 text-center text-white md:p-10">
            <h1 className="text-2xl font-semibold md:text-2xl">
              CONNEXION ADMIN
            </h1>
            <p className="max-w-xs text-sm md:max-w-sm md:text-base opacity-95">
              Connectez-vous pour accéder à l'espace administrateur.
            </p>
            <small className="mt-2 text-xs opacity-90">© 2025</small>
          </div>
        </motion.div>

        <motion.div
          variants={formVariants}
          className="flex items-center justify-center w-full transition-colors bg-white md:w-7/12 lg:w-6/12"
        >
          <div
            className="w-full px-6 py-8 md:px-10 md:py-12"
            style={{ maxWidth: 560, width: "100%" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Connexion</h2>
              <button
                onClick={() => navigate("/register")}
                className="px-3 py-1 text-sm text-white rounded bg-sky-500 hover:bg-sky-600"
              >
                Inscription
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={fieldVariants}>
                <label className="block text-xs font-medium text-black">EMAIL</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className={`pl-10 pr-2 py-2 w-full border-b text-sm focus:outline-none bg-transparent ${
                      errors.email ? "border-red-500" : "border-slate-200"
                    }`}
                    placeholder="Entrez votre email"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </motion.div>

              <motion.div variants={fieldVariants}>
                <label className="block text-xs font-medium text-black">MOT DE PASSE</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type={showPwd ? "text" : "password"}
                    className={`pl-10 pr-10 py-2 w-full border-b text-sm focus:outline-none bg-transparent ${
                      errors.password ? "border-red-500" : "border-slate-200"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute p-1 right-2 top-2 text-slate-500"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </motion.div>

              <motion.div variants={fieldVariants} className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-sky-600"
                  />
                  <span className="text-xs">Se souvenir de moi</span>
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs underline text-sky-600"
                >
                  Mot de passe oublié ?
                </button>
              </motion.div>

              {serverError && <div className="text-sm text-red-600">{serverError}</div>}

              <motion.button
                type="submit"
                whileTap={btnTap}
                whileHover={{ scale: 1.01 }}
                disabled={loading || success}
                className="w-full py-2 text-sm text-white rounded-md bg-sky-500 hover:bg-sky-600 disabled:opacity-60"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </motion.button>

              <div className="mt-4 text-sm text-center text-slate-600">
                Pas de compte ?{" "}
                <button onClick={() => navigate("/register")} className="underline text-sky-600">
                  S'inscrire
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 transform -translate-x-1/2 left-1/2 bottom-8"
          >
            <div className="flex items-center px-4 py-3 space-x-3 text-white bg-green-500 rounded-lg shadow-lg">
              <Check className="w-5 h-5" />
              <span>Connexion réussie — redirection...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}