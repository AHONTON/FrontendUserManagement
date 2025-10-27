import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserModal({ isOpen, onClose, onSubmit, editingUser }) {
  const [formData, setFormData] = useState({
    photo: null,
    nom: "",
    prenoms: "",
    email: "",
    telephone: "",
    residence: "",
    domaine: "",
    fonction: "",
    structure: "",
    lieuTravail: "",
    contact: "",
    opportunites: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  // Pré-remplissage des champs et photo
  useEffect(() => {
    if (editingUser) {
      setFormData({
        photo: null,
        nom: editingUser.nom || "",
        prenoms: editingUser.prenoms || "",
        email: editingUser.email || "",
        telephone: editingUser.telephone || "",
        residence: editingUser.residence || "",
        domaine: editingUser.domaine || "",
        fonction: editingUser.fonction || "",
        structure: editingUser.structure || "",
        lieuTravail: editingUser.lieuTravail || "",
        contact: editingUser.contact || "",
        opportunites: editingUser.opportunites || "",
      });

      // Affiche la photo existante uniquement si aucune photo temporaire
      if (editingUser.photo) {
        setPreviewUrl(
          `${import.meta.env.VITE_FILE_BASE_URL}/${editingUser.photo}`
        );
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData({
        photo: null,
        nom: "",
        prenoms: "",
        email: "",
        telephone: "",
        residence: "",
        domaine: "",
        fonction: "",
        structure: "",
        lieuTravail: "",
        contact: "",
        opportunites: "",
      });
      setPreviewUrl(null);
    }
  }, [editingUser]);

  // Gestion des fichiers (nouvelle photo)
  const handleFileSelect = (file) => {
    if (!file) return;

    // Révoque l'ancienne URL blob
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setFormData((prev) => ({ ...prev, photo: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Gestion des champs texte
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.nom ||
      !formData.prenoms ||
      !formData.email ||
      !formData.telephone
    ) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") data.append(key, value);
    });

    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 text-white bg-gradient-to-r from-blue-600 to-blue-700">
              <h2 className="text-2xl font-bold">
                {editingUser
                  ? "Modifier l'utilisateur"
                  : "Ajouter un utilisateur"}
              </h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Photo */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Photo
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFileSelect(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileInputRef.current.click()}
                  className={`w-full px-4 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center ${
                    dragOver
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Prévisualisation"
                      className="object-cover w-24 h-24 mb-3 rounded-full"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                  <p
                    className={`cursor-pointer text-gray-400 ${
                      dragOver ? "text-blue-600" : ""
                    }`}
                  >
                    {previewUrl
                      ? "Changer la photo"
                      : "Glissez-déposez ou cliquez pour choisir une photo"}
                  </p>
                </div>
              </div>

              {/* Champs texte */}
              {[
                "nom",
                "prenoms",
                "email",
                "telephone",
                "residence",
                "domaine",
                "fonction",
                "structure",
                "lieuTravail",
                "contact",
                "opportunites",
              ].map((field) => (
                <div key={field}>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {field}
                  </label>
                  {field === "opportunites" ? (
                    <textarea
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}

              {/* Boutons */}
              <div className="flex gap-4 pt-6 mt-8 border-t border-gray-200">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Annuler
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {editingUser ? "Modifier" : "Ajouter"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
