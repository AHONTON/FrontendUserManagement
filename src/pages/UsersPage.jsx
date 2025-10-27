import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, ChevronLeft, ChevronRight } from "lucide-react";
import UserCard from "../components/Layout/UserCard";
import UserModal from "../components/Layout/UserModal";
import UserDetailModal from "../components/Layout/UserDetailModal";
import { useTheme } from "../components/contexts/ThemeContext";
import SwalHelper from "../utils/SwalHelper";

export default function Dashboard() {
  const { theme, isDark } = useTheme();
  const API_URL = import.meta.env.VITE_API_URL;

  const getPhotoUrl = (photo) => {
    if (!photo) return "/professional-headshot.png"; // image par défaut si aucune photo
    return photo.startsWith("http") ? photo : `${API_URL}/${photo}`;
  };

  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  // Charger les utilisateurs
  const fetchUsers = async () => {
    const loadingAlert = SwalHelper.loading("Chargement des utilisateurs...");
    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");

      if (!token)
        throw new Error("Token non trouvé. Veuillez vous reconnecter.");

      const response = await fetch(`${API_URL}/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error("Erreur lors du chargement des utilisateurs.");

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      SwalHelper.error("Erreur", error.message);
    } finally {
      loadingAlert.close();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Ajouter utilisateur
  const handleAddUser = async (userData) => {
    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");
    if (!token)
      return SwalHelper.error("Token manquant", "Veuillez vous reconnecter.");

    const loadingAlert = SwalHelper.loading("Ajout de l'utilisateur...");
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: userData,
      });

      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Erreur lors de l'ajout");

      // ✅ Mise à jour locale
      setUsers((prev) => [data.user, ...prev]);
      setIsModalOpen(false);
      SwalHelper.success(
        "Succès",
        data.message || "Utilisateur ajouté avec succès"
      );
    } catch (error) {
      SwalHelper.error("Erreur", error.message);
    } finally {
      loadingAlert.close();
    }
  };

  // Modifier utilisateur
  const handleEditUser = async (userData) => {
    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");
    if (!token)
      return SwalHelper.error("Token manquant", "Veuillez vous reconnecter.");
    if (!editingUser?._id && !editingUser?.id)
      return SwalHelper.error(
        "Erreur",
        "Aucun utilisateur sélectionné pour la mise à jour."
      );

    const loadingAlert = SwalHelper.loading("Mise à jour de l'utilisateur...");
    try {
      const response = await fetch(
        `${API_URL}/user/${editingUser._id || editingUser.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: userData,
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Erreur lors de la mise à jour");

      // ✅ Mise à jour locale
      setUsers((prev) =>
        prev.map((u) =>
          u._id === (editingUser._id || editingUser.id) ? data.updatedUser : u
        )
      );
      setEditingUser(null);
      setIsModalOpen(false);
      SwalHelper.success(
        "Succès",
        data.message || "Utilisateur mis à jour avec succès"
      );
    } catch (error) {
      SwalHelper.error("Erreur", error.message);
    } finally {
      loadingAlert.close();
    }
  };

  // Supprimer utilisateur
  const handleDeleteUser = async (userId) => {
    const confirmResult = await SwalHelper.confirm(
      "Êtes-vous sûr ?",
      "Cette action supprimera l'utilisateur de manière irréversible.",
      "Oui, supprimer"
    );
    if (!confirmResult.isConfirmed) return;

    const loadingAlert = SwalHelper.loading("Suppression de l'utilisateur...");
    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
      if (!token)
        return SwalHelper.error("Token manquant", "Veuillez vous reconnecter.");

      const response = await fetch(`${API_URL}/user/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Erreur lors de la suppression");

      setUsers((prev) => prev.filter((u) => u._id !== userId));
      SwalHelper.success(
        "Succès",
        data.message || "Utilisateur supprimé avec succès"
      );
    } catch (error) {
      SwalHelper.error("Erreur", error.message);
    } finally {
      loadingAlert.close();
    }
  };

  // Voir détails utilisateur
  const handleViewDetails = async (user) => {
    const loadingAlert = SwalHelper.loading("Chargement des détails...");
    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
      if (!token)
        return SwalHelper.error("Token non trouvé. Veuillez vous reconnecter.");

      const response = await fetch(`${API_URL}/user/${user._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error("Erreur lors du chargement des détails");
      const data = await response.json();

      // ✅ Correction : passer le bon objet
      setSelectedUser(data.user || data);
      setIsDetailModalOpen(true);
    } catch (error) {
      SwalHelper.error("Erreur", error.message);
    } finally {
      loadingAlert.close();
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 pb-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1
                className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}
              >
                Gestion des Utilisateurs
              </h1>
              <p
                className={`text-lg ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Gérez votre équipe et leurs informations professionnelles
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-4 py-2 rounded-full border ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-gray-300"
                    : "bg-white border-blue-200 text-blue-700 shadow-sm"
                }`}
              >
                <span className="text-sm font-semibold">
                  {users.length} utilisateur{users.length !== 1 ? "s" : ""}
                </span>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" /> Ajouter un utilisateur
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Users Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`mb-8 p-6 rounded-2xl border shadow-lg transition-colors duration-300 ${
            isDark
              ? "bg-gray-800 border-gray-700 shadow-gray-900/20"
              : "bg-white/80 backdrop-blur-sm border-gray-200 shadow-gray-900/10"
          }`}
        >
          <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {currentUsers.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
              >
                <AnimatePresence>
                  {currentUsers.map((user, index) => (
                    <UserCard
                      key={user._id || `temp-${index}`}
                      user={{ ...user, photo: getPhotoUrl(user.photo) }}
                      index={index}
                      onView={() => handleViewDetails(user)}
                      onEdit={() => openEditModal(user)}
                      onDelete={() => handleDeleteUser(user._id || user.id)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <EmptyState
                isDark={isDark}
                onAddUser={() => setIsModalOpen(true)}
              />
            )}
          </div>
        </motion.section>

        {/* Pagination */}
        {users.length > 0 && totalPages > 1 && (
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-2xl border shadow-lg ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white/80 backdrop-blur-sm border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div
                className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Affichage de {indexOfFirstUser + 1} à{" "}
                {Math.min(indexOfLastUser, users.length)} sur {users.length}{" "}
                utilisateurs
              </div>

              <div className="flex items-center gap-2">
                <PaginationButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  isDark={isDark}
                  direction="prev"
                >
                  Précédent
                </PaginationButton>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          currentPage === pageNumber
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                            : isDark
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  )}
                </div>
                <PaginationButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  isDark={isDark}
                  direction="next"
                >
                  Suivant
                </PaginationButton>
              </div>
            </div>
          </motion.nav>
        )}

        {users.length === 0 && (
          <EmptyState isDark={isDark} onAddUser={() => setIsModalOpen(true)} />
        )}
      </div>

      {/* Modals */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        editingUser={editingUser}
      />
      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={
          selectedUser
            ? { ...selectedUser, photo: getPhotoUrl(selectedUser.photo) }
            : null
        }
      />
    </div>
  );
}

// Empty state
const EmptyState = ({ isDark, onAddUser }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="py-16 text-center"
  >
    <div
      className={`max-w-md mx-auto p-8 rounded-2xl border ${
        isDark
          ? "bg-gray-800 border-gray-700"
          : "bg-white/80 backdrop-blur-sm border-gray-200"
      }`}
    >
      <div className="mb-6">
        <div
          className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDark ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <Users
            className={`w-10 h-10 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
        </div>
        <h3
          className={`text-xl font-semibold mb-2 ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Aucun utilisateur
        </h3>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Commencez par ajouter votre premier utilisateur à l'équipe
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddUser}
        className="px-6 py-3 font-semibold text-white transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl"
      >
        Ajouter un utilisateur
      </motion.button>
    </div>
  </motion.div>
);

// Pagination button
const PaginationButton = ({
  onClick,
  disabled,
  isDark,
  direction,
  children,
}) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
      isDark
        ? "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:hover:bg-gray-700"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100"
    }`}
  >
    {direction === "prev" && <ChevronLeft className="w-4 h-4" />}
    {children}
    {direction === "next" && <ChevronRight className="w-4 h-4" />}
  </motion.button>
);
