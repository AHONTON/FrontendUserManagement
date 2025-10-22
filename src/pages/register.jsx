import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Check, Image as ImageIcon, X } from "lucide-react";

const API_BASE =
  (import.meta?.env?.VITE_API_URL && String(import.meta.env.VITE_API_URL)) ||
  "/api";
const API_URL = `${API_BASE.replace(/\/$/, "")}/register`;

/* Variants framer-motion */
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

export default function RegisterPage() {
  const navigate = useNavigate();

  // état du formulaire (nom, prénom, email, photo/file, sexe, mot de passe)
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    // photo URL (optionnel) — si l'utilisateur colle une URL ; on privilégie le fichier uploadé
    photo: "",
    sexe: "",
    password: "",
    terms: false,
  });

  // état fichier pour upload (File) + preview URL
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const dropRef = useRef(null);

  // UI states
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  // génération et nettoyage de la preview
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // validation légère côté client (contrôles basiques, validation finale côté serveur)
  const validate = () => {
    const e = {};
    if (!form.lastName.trim()) e.lastName = "Le nom est requis";
    if (!form.firstName.trim()) e.firstName = "Le prénom est requis";
    if (!form.email.trim()) e.email = "L'email est requis";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email invalide";
    if (!form.password || form.password.length < 6)
      e.password = "Le mot de passe doit contenir au moins 6 caractères";
    if (!form.sexe) e.sexe = "Le sexe est requis";
    // si pas de fichier, on autorise une URL photo (optionnelle) — si fournie, vérifier format minimal
    if (!file && form.photo && !/^https?:\/\//.test(form.photo))
      e.photo = "URL de la photo invalide (doit commencer par http(s)://)";
    if (!form.terms) e.terms = "Vous devez accepter les conditions";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // gestion des changements d'input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  // gestion du fichier sélectionné via input
  const handleFileSelect = (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        photo: "Le fichier doit être une image",
      }));
      return;
    }
    setFile(f);
    setErrors((prev) => ({ ...prev, photo: undefined }));
  };

  // drag & drop handlers
  const handleDrop = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const f = ev.dataTransfer?.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        photo: "Le fichier doit être une image",
      }));
      return;
    }
    setFile(f);
    setErrors((prev) => ({ ...prev, photo: undefined }));
  };
  const handleDragOver = (ev) => {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "copy";
  };
  const removeFile = () => {
    setFile(null);
  };

  // envoi du formulaire : si file présent => FormData, sinon JSON
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);

    try {
      let res;
      if (file) {
        // envoi multipart/form-data
        const fd = new FormData();
        fd.append("photo", file);
        fd.append("nom", form.lastName);
        fd.append("prenom", form.firstName);
        fd.append("email", form.email);
        fd.append("sexe", form.sexe);
        fd.append("password", form.password);
        // terms non envoyé (ou envoyer si nécessaire)
        res = await fetch(API_URL, {
          method: "POST",
          body: fd, // pas d'entête Content-Type : browser le règle
        });
      } else {
        // envoi JSON (photo peut être une URL dans form.photo)
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom: form.lastName,
            prenom: form.firstName,
            email: form.email,
            photo: form.photo || null,
            sexe: form.sexe,
            password: form.password,
          }),
        });
      }

      let data = {};
      try {
        data = await res.json();
      } catch (_) {}

      if (!res.ok) {
        setServerError(data?.message || `Erreur serveur (${res.status})`);
        setLoading(false);
        return;
      }

      // succès — la validation finale et le stockage photo se font côté serveur / modèle MongoDB
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setServerError("Impossible de contacter le serveur");
      setLoading(false);
    }
  };

  return (
    <motion.div
      // wrapper principal centré
      className="flex items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-sky-900 to-sky-700"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* conteneur principal côte à côte on md+, empilé sur small */}
      <div
        className="flex flex-col items-stretch w-full max-w-6xl mx-4 overflow-hidden shadow-xl md:mx-0 md:flex-row rounded-xl"
        style={{ minHeight: 520 }}
      >
        {/* colonne image */}
        <motion.div
          variants={leftVariants}
          className="relative flex items-center justify-center w-full text-center bg-black md:w-5/12 lg:w-6/12"
        >
          <img
            src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80"
            alt="illustration"
            className="absolute inset-0 object-cover object-center w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/65 to-sky-700/30 dark:from-blue-900/65 dark:to-blue-900/35" />
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full gap-4 p-6 text-center text-white md:p-10">
            <h1 className="text-2xl font-semibold md:text-2xl">
              BIENVENU SUR L'ESPACE ADMINISTRATEUR
            </h1>
            <p className="max-w-xs text-sm text-justify md:max-w-sm md:text-base opacity-95">
              Créez votre compte en quelques secondes et accédez à votre tableau
              de bord. Interface moderne et animations fluides.
            </p>
            <small className="mt-2 text-xs opacity-90">© 2025 </small>
          </div>
        </motion.div>

        {/* colonne formulaire */}
        <motion.div
          variants={formVariants}
          className="flex items-center justify-center w-full transition-colors bg-white md:w-7/12 lg:w-6/12 dark:bg-blue-900 dark:text-white"
        >
          <div
            className="w-full px-4 py-6 md:px-8 md:py-10"
            style={{
              maxWidth: 760,
              width: "100%",
              maxHeight: "72vh",
              overflow: "auto",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Inscription</h2>
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-1 text-sm text-white rounded bg-sky-500 hover:bg-sky-600"
              >
                Connexion
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* zone upload : choisir ou drag & drop */}
              <motion.div variants={fieldVariants}>
                <label className="block text-xs font-medium text-black dark:text-blue-100">
                  PHOTO DE PROFIL
                </label>

                <div
                  ref={dropRef}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="flex items-center w-full gap-3 p-3 mt-2 bg-transparent border-2 border-dashed rounded-md border-slate-200 dark:border-blue-800"
                  style={{ minHeight: 84 }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-black dark:text-blue-200" />
                      <div className="flex-1 text-sm text-black dark:text-blue-100">
                        <div>Glissez-déposez une image ou</div>
                        <label className="inline-block underline cursor-pointer text-sky-600">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="sr-only"
                          />
                          choisissez un fichier
                        </label>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-400 dark:text-blue-200">
                      PNG, JPG, GIF — taille recommandée &lt; 2MB
                    </p>
                    {errors.photo && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.photo}
                      </p>
                    )}
                  </div>

                  {/* aperçu miniature + bouton supprimer */}
                  <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 overflow-hidden rounded bg-slate-50 dark:bg-blue-800">
                    {preview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={preview}
                          alt="preview"
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={removeFile}
                          className="absolute p-1 bg-white rounded-full shadow -top-2 -right-2 dark:bg-slate-700"
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    ) : form.photo ? (
                      <img
                        src={form.photo}
                        alt="photo-url"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300 dark:text-blue-200" />
                    )}
                  </div>
                </div>
              </motion.div>

              {/* grille 2 colonnes pour le formulaire */}
              <motion.div
                variants={fieldVariants}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {/* NOM */}
                <div>
                  <label className="block text-xs font-medium text-black dark:text-blue-100">
                    NOM
                  </label>
                  <div className="relative mt-1">
                    <User
                      className="absolute left-3 top-3 text-slate-400 dark:text-blue-200"
                      size={16}
                    />
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className={`pl-10 pr-2 py-2 w-full border-b text-sm focus:outline-none bg-transparent ${
                        errors.lastName
                          ? "border-red-500"
                          : "border-slate-200 dark:border-blue-800"
                      }`}
                      placeholder="Entrez votre nom"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* PRÉNOM */}
                <div>
                  <label className="block text-xs font-medium text-black dark:text-blue-100">
                    PRÉNOM
                  </label>
                  <div className="relative mt-1">
                    <User
                      className="absolute left-3 top-3 text-slate-400 dark:text-blue-200"
                      size={16}
                    />
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className={`pl-10 pr-2 py-2 w-full border-b text-sm focus:outline-none bg-transparent ${
                        errors.firstName
                          ? "border-red-500"
                          : "border-slate-200 dark:border-blue-800"
                      }`}
                      placeholder="Entrez votre prénom"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-xs font-medium text-black dark:text-blue-100">
                    EMAIL
                  </label>
                  <div className="relative mt-1">
                    <Mail
                      className="absolute left-3 top-3 text-slate-400 dark:text-blue-200"
                      size={16}
                    />
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      className={`pl-10 pr-2 py-2 w-full border-b text-sm focus:outline-none bg-transparent ${
                        errors.email
                          ? "border-red-500"
                          : "border-slate-200 dark:border-blue-800"
                      }`}
                      placeholder="Entrez votre email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* SEXE */}
                <div>
                  <label className="block text-xs font-medium text-black dark:text-blue-100">
                    SEXE
                  </label>
                  <div className="mt-1">
                    <select
                      name="sexe"
                      value={form.sexe}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border-b bg-transparent focus:outline-none ${
                        errors.sexe
                          ? "border-red-500"
                          : "border-slate-200 dark:border-blue-800"
                      }`}
                    >
                      <option value="">Sélectionner</option>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  {errors.sexe && (
                    <p className="mt-1 text-xs text-red-500">{errors.sexe}</p>
                  )}
                </div>

                {/* PHOTO URL si l'utilisateur préfère coller une URL (optionnel) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-black dark:text-blue-100">
                    URL DE LA PHOTO (optionnel)
                  </label>
                  <div className="relative mt-1">
                    <ImageIcon
                      className="absolute left-3 top-3 text-slate-400 dark:text-blue-200"
                      size={16}
                    />
                    <input
                      name="photo"
                      value={form.photo}
                      onChange={handleChange}
                      placeholder="https://..."
                      className={`pl-10 pr-2 py-2 w-full border-b text-sm focus:outline-none bg-transparent ${
                        errors.photo
                          ? "border-red-500"
                          : "border-slate-200 dark:border-blue-800"
                      }`}
                    />
                  </div>
                  {errors.photo && (
                    <p className="mt-1 text-xs text-red-500">{errors.photo}</p>
                  )}
                </div>

                {/* MOT DE PASSE (occupe toute la largeur) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-black dark:text-blue-100">
                    MOT DE PASSE
                  </label>
                  <div className="relative mt-1">
                    <Lock
                      className="absolute left-3 top-3 text-slate-400 dark:text-blue-200"
                      size={16}
                    />
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type="password"
                      placeholder="••••••••"
                      className={`pl-10 pr-2 py-2 w-full border-b text-sm focus:outline-none bg-transparent ${
                        errors.password
                          ? "border-red-500"
                          : "border-slate-200 dark:border-blue-800"
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* contrôles et bouton en pleine largeur */}
              <motion.div variants={fieldVariants} className="mt-3 space-y-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={form.terms}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-sky-600"
                  />
                  <span className="text-xs text-black dark:text-blue-100">
                    J'accepte les{" "}
                    <a href="/terms" className="underline text-sky-600">
                      conditions
                    </a>
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
                )}

                {serverError && (
                  <div className="text-sm text-red-600">{serverError}</div>
                )}

                <motion.button
                  type="submit"
                  whileTap={btnTap}
                  whileHover={{ scale: 1.01 }}
                  disabled={loading || success}
                  className="w-full py-2 text-sm text-white rounded-md bg-sky-500 hover:bg-sky-600 disabled:opacity-60"
                >
                  {loading ? "Création..." : "Créer un compte admin"}
                </motion.button>
              </motion.div>

              <div className="mt-4 text-sm text-center text-black dark:text-blue-200">
                Déjà un compte ?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="underline text-sky-600"
                >
                  Se connecter
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* notification succès */}
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
              <span>Inscription réussie — redirection...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
