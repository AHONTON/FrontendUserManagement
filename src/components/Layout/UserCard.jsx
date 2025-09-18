import { motion } from "framer-motion"
import { useTheme } from "../contexts/ThemeContext"

export default function UserCard({ user, index, onView, onEdit, onDelete }) {
  const { theme } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className={`overflow-hidden transition-all duration-300 shadow-lg rounded-xl hover:shadow-xl group
        ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white"}
      `}
    >
      {/* Header avec photo */}
      <div
        className={`relative p-4 text-center ${
          theme === "dark"
            ? "bg-gradient-to-r from-gray-700 to-gray-800"
            : "bg-gradient-to-r from-blue-600 to-blue-700"
        }`}
      >
        <div className="w-16 h-16 mx-auto mb-3 overflow-hidden border-white rounded-full shadow-lg border-3">
          <img
            src={user.photo || "/professional-headshot.png"}
            alt={`${user.prenoms} ${user.nom}`}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-sm font-bold text-white">
          {user.prenoms} {user.nom}
        </h3>
        <p className="text-xs text-blue-100">{user.fonction}</p>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-lg
                ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-blue-100 text-blue-600"}
              `}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Structure
              </p>
              <p
                className={`text-xs font-medium truncate ${
                  theme === "dark" ? "text-gray-200" : "text-gray-900"
                }`}
              >
                {user.structure}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          className={`flex gap-1 pt-3 border-t ${
            theme === "dark" ? "border-gray-700" : "border-gray-100"
          }`}
        >
          {/* Voir */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onView}
            className="flex items-center justify-center flex-1 gap-1 px-2 py-2 text-xs font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Voir
          </motion.button>

          {/* Modifier */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className={`flex items-center justify-center flex-1 gap-1 px-2 py-2 text-xs font-medium rounded-lg transition-colors
              ${theme === "dark"
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
            `}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Modifier
          </motion.button>

          {/* Supprimer */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="flex items-center justify-center px-2 py-2 text-xs font-medium text-red-600 transition-colors bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
