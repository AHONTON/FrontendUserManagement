import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// UserModal component for adding/editing users
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

  useEffect(() => {
    if (editingUser) {
      setFormData(editingUser);
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
    }
  }, [editingUser, isOpen]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Drag and drop state and ref
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Préparer les données du formulaire
    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    onSubmit(data); // Assure-toi que ton onSubmit sait gérer FormData
  };

  // Render modal
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
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingUser
                    ? "Modifier l'utilisateur"
                    : "Ajouter un utilisateur"}
                </h2>
                <button
                  onClick={onClose}
                  className="transition-colors text-white/80 hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      const file = e.dataTransfer.files[0];
                      if (file) setFormData({ ...formData, photo: file });
                    }}
                    onClick={() => fileInputRef.current.click()}
                    className={`w-full px-4 py-12 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                      dragOver
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white"
                    } flex flex-col items-center justify-center text-center`}
                  >
                    {formData.photo ? (
                      <p className="text-sm text-gray-700 truncate">
                        {formData.photo.name}
                      </p>
                    ) : (
                      <>
                        <p className="text-gray-400">
                          Glissez-déposez votre photo ici
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          ou cliquez pour sélectionner un fichier
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) setFormData({ ...formData, photo: file });
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
                {/* Nom */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dupont"
                  />
                </div>

                {/* Prénoms */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Prénoms *
                  </label>
                  <input
                    type="text"
                    name="prenoms"
                    value={formData.prenoms}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jean Pierre"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jean.dupont@email.com"
                  />
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                {/* Résidence */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Résidence *
                  </label>
                  <input
                    type="text"
                    name="residence"
                    value={formData.residence}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Paris, France"
                  />
                </div>

                {/* Domaine */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Domaine de compétence *
                  </label>
                  <input
                    type="text"
                    name="domaine"
                    value={formData.domaine}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Développement Web"
                  />
                </div>

                {/* Fonction */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Fonction actuelle *
                  </label>
                  <input
                    type="text"
                    name="fonction"
                    value={formData.fonction}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Développeur Full Stack"
                  />
                </div>

                {/* Structure */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Structure *
                  </label>
                  <input
                    type="text"
                    name="structure"
                    value={formData.structure}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tech Solutions SARL"
                  />
                </div>

                {/* Lieu de travail */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Lieu de travail *
                  </label>
                  <input
                    type="text"
                    name="lieuTravail"
                    value={formData.lieuTravail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Paris La Défense"
                  />
                </div>

                {/* Contact d'urgence */}
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Personne à contacter (urgence) *
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Marie Dupont - 06 87 65 43 21"
                  />
                </div>

                {/* Opportunités */}
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Opportunités
                  </label>
                  <textarea
                    name="opportunites"
                    value={formData.opportunites}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Stages, Consultations, autres..."
                  />
                </div>
              </div>

              {/* Actions */}
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
