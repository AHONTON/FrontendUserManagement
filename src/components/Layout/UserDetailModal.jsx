"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Building, 
  Navigation, 
  AlertTriangle, 
  Target, 
  X,
  UserCircle
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function UserDetailModal({ isOpen, onClose, user }) {
  const { theme, isDark } = useTheme();
  if (!user) return null;

  const fields = [
    { label: "Nom", value: user.nom, icon: User },
    { label: "Prénoms", value: user.prenoms, icon: UserCircle },
    { label: "Email", value: user.email, icon: Mail },
    { label: "Téléphone", value: user.telephone, icon: Phone },
    { label: "Résidence", value: user.residence, icon: MapPin },
    {
      label: "Domaine de compétence",
      value: user.domaine,
      icon: Target,
    },
    {
      label: "Fonction actuelle",
      value: user.fonction,
      icon: Briefcase,
    },
    { label: "Structure", value: user.structure, icon: Building },
    {
      label: "Lieu de travail",
      value: user.lieuTravail,
      icon: Navigation,
    },
    {
      label: "Contact d'urgence",
      value: user.contact,
      icon: AlertTriangle,
    },
    { label: "Opportunités", value: user.opportunites, icon: Target },
  ];

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
            className={`rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transition-colors duration-300
              ${
                isDark
                  ? "bg-gray-900 text-gray-100"
                  : "bg-white text-gray-900"
              }
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header avec photo */}
            <div
              className={`relative p-8 text-white transition-colors duration-300 
                ${
                  isDark
                    ? "bg-gradient-to-r from-gray-800 to-gray-700"
                    : "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600"
                }
              `}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute p-2 transition-all duration-300 rounded-full top-6 right-6 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </motion.button>

              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="overflow-hidden border-4 rounded-full shadow-xl w-28 h-28 border-white/30 bg-white/10 backdrop-blur-sm"
                >
                  <img
                    src={user.photo || "/professional-headshot.png"}
                    alt={`${user.prenoms} ${user.nom}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="items-center justify-center hidden w-full h-full">
                    <User className="w-16 h-16 text-white/60" />
                  </div>
                </motion.div>
                <div className="text-center sm:text-left">
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-3 text-3xl font-bold"
                  >
                    {user.prenoms} {user.nom}
                  </motion.h2>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-1 text-lg opacity-90"
                  >
                    {user.fonction}
                  </motion.p>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="opacity-70"
                  >
                    {user.structure}
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Contenu détaillé */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                {fields.map((field, index) => {
                  const IconComponent = field.icon;
                  return (
                    <motion.div
                      key={field.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className={`group p-5 rounded-xl border transition-all duration-300 hover:shadow-md
                        ${
                          isDark
                            ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800 text-gray-200"
                            : "bg-gray-50/50 border-gray-200 hover:bg-white text-gray-900 hover:shadow-lg"
                        }
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl transition-all duration-300 group-hover:scale-110
                            ${
                              isDark
                                ? "bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30"
                                : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                            }
                          `}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`mb-2 text-sm font-semibold uppercase tracking-wide ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {field.label}
                          </h3>
                          <p className={`font-medium break-words leading-relaxed ${
                            field.value 
                              ? (isDark ? "text-gray-100" : "text-gray-900")
                              : (isDark ? "text-gray-500 italic" : "text-gray-400 italic")
                          }`}>
                            {field.value || "Non renseigné"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className={`flex justify-end pt-8 mt-8 border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className={`px-8 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 
                    ${
                      isDark
                        ? "bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100 hover:from-gray-600 hover:to-gray-500 hover:shadow-xl"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                    }
                  `}
                >
                  Fermer
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}