import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users, Briefcase, Grid, Search, Download } from "lucide-react";
import Modal from "../components/UI/Modal";
import SwalHelper from "./../utils/SwalHelper";

// Définir l'URL de base de l'API avec Vite
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

const DashboardPage = () => {
  const [statsData, setStatsData] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Récupérer le token d'authentification depuis localStorage
  const authToken = localStorage.getItem("authToken") || "";

  // Fetcher les données de l'API au montage du composant
  useEffect(() => {
    // Appel API pour récupérer les statistiques avec alertes et authentification
    const fetchStats = async () => {
      SwalHelper.loading(
        "Chargement des statistiques",
        "Veuillez patienter..."
      );
      try {
        const response = await fetch(`${API_URL}/stats`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Unauthorized"
              : "Erreur lors de la récupération des statistiques"
          );
        }
        const data = await response.json();
        const mappedStats = [
          {
            label: "Total Utilisateurs",
            value: data.totalUsers || 0,
            icon: <User className="w-6 h-6" />,
          },
          {
            label: "Nouveaux ce mois",
            value: data.newThisMonth || 0,
            icon: <Users className="w-6 h-6" />,
          },
          {
            label: "Structures",
            value: data.structures || 0,
            icon: <Grid className="w-6 h-6" />,
          },
          {
            label: "Domaines d'Expertise",
            value: data.domains || 0,
            icon: <Briefcase className="w-6 h-6" />,
          },
        ];
        setStatsData(mappedStats);
        SwalHelper.success("Succès", "Statistiques chargées avec succès");
      } catch (error) {
        SwalHelper.error(
          "Erreur",
          error.message === "Unauthorized"
            ? "Authentification requise"
            : "Impossible de charger les statistiques"
        );
        console.error("Erreur fetch stats:", error);
      }
    };

    // Appel API pour récupérer les 5 derniers utilisateurs avec alertes et authentification
    const fetchRecentUsers = async () => {
      SwalHelper.loading(
        "Chargement des utilisateurs",
        "Veuillez patienter..."
      );
      try {
        const response = await fetch(`${API_URL}/recent-users?limit=5`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Unauthorized"
              : "Erreur lors de la récupération des utilisateurs récents"
          );
        }
        const data = await response.json();
        setRecentUsers(data);
        SwalHelper.success(
          "Succès",
          "Utilisateurs récents chargés avec succès"
        );
      } catch (error) {
        SwalHelper.error(
          "Erreur",
          error.message === "Unauthorized"
            ? "Authentification requise"
            : "Impossible de charger les utilisateurs récents"
        );
        console.error("Erreur fetch users:", error);
      }
    };

    // Vérifier si le token existe avant de lancer les requêtes
    if (authToken) {
      fetchStats();
      fetchRecentUsers();
    } else {
      SwalHelper.error(
        "Erreur",
        "Aucun token d'authentification trouvé. Veuillez vous connecter."
      );
    }
  }, [authToken]);

  // Fonction pour gérer l'exportation des utilisateurs
  const handleExportUsers = async () => {
    // Afficher une confirmation avant de lancer l'exportation
    const result = await SwalHelper.confirm(
      "Exporter les utilisateurs",
      "Voulez-vous exporter la liste des utilisateurs ?",
      "Oui, exporter"
    );
    if (!result.isConfirmed) return;

    // Appel API pour exporter les utilisateurs avec authentification
    SwalHelper.loading("Exportation en cours", "Génération du fichier...");
    try {
      const response = await fetch(`${API_URL}/export-users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "text/csv",
        },
      });
      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Unauthorized"
            : "Erreur lors de l'exportation des utilisateurs"
        );
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users_export.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      SwalHelper.success("Succès", "Fichier exporté avec succès");
    } catch (error) {
      SwalHelper.error(
        "Erreur",
        error.message === "Unauthorized"
          ? "Authentification requise"
          : "Impossible d'exporter les utilisateurs"
      );
      console.error("Erreur export users:", error);
    }
  };

  // Filtrer les utilisateurs selon la recherche
  const filteredUsers = useMemo(() => {
    return recentUsers.filter(
      (user) =>
        user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.prenoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, recentUsers]);

  const openUserModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {statsData.map((stat, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="flex items-center p-4 space-x-4 bg-white shadow-lg rounded-2xl dark:bg-gray-800"
          >
            <div className="p-3 text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900">
              {stat.icon}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col flex-1 space-y-4 overflow-hidden">
        <div className="flex flex-col items-start justify-between space-y-3 md:flex-row md:items-center md:space-y-0">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Utilisateurs récents
          </h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center p-2 space-x-2 bg-white rounded-full shadow-sm dark:bg-gray-800">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm placeholder-gray-500 bg-transparent outline-none dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleExportUsers}
              className="flex items-center px-3 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700"
              disabled={!authToken} // Désactiver le bouton si pas de token
            >
              <Download className="w-4 h-4 mr-1" /> Exporter
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {filteredUsers.map((user, i) => (
              <motion.div
                key={user.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="flex flex-col items-center p-4 bg-white shadow-lg rounded-2xl dark:bg-gray-800"
              >
                <img
                  src={user.photo}
                  alt="avatar"
                  className="object-cover w-20 h-20 rounded-full"
                />
                <p className="mt-2 font-semibold text-gray-800 dark:text-gray-100">
                  {user.nom} {user.prenoms}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
                <button
                  onClick={() => openUserModal(user)}
                  className="px-3 py-1 mt-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700"
                >
                  Voir détails
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedUser && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={`${selectedUser.nom} ${selectedUser.prenoms}`}
          >
            <div className="space-y-2 text-gray-800 dark:text-gray-100">
              <img
                src={selectedUser.photo}
                alt="avatar"
                className="object-cover w-24 h-24 mx-auto rounded-full"
              />
              <p>Email: {selectedUser.email}</p>
              <p>Téléphone: {selectedUser.telephone}</p>
              <p>Résidence: {selectedUser.residence}</p>
              <p>Domaine: {selectedUser.domaine}</p>
              <p>Fonction: {selectedUser.fonction}</p>
              <p>Structure: {selectedUser.structure}</p>
              <p>Lieu de travail: {selectedUser.lieuTravail}</p>
              <p>Contact urgence: {selectedUser.contactUrgence}</p>
              <p>
                Opportunités:{" "}
                {selectedUser.opportunites.map((op, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 ml-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200"
                  >
                    {op}
                  </span>
                ))}
              </p>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
