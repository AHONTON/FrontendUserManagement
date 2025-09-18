import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Intégration de React à SweetAlert2
const MySwal = withReactContent(Swal);

// Options de base appliquées à toutes les alertes
const baseOptions = {
  position: "center",
  background: "#111827",
  color: "#FFFFFF",
  buttonsStyling: false,
  customClass: {
    popup: "text-base rounded-xl px-6 py-4",
    title: "text-xl font-semibold",
    htmlContainer: "text-sm",
    confirmButton:
      "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow",
    cancelButton:
      "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow",
  },
};

// Affiche une alerte de chargement avec indicateur
const loading = (title = "Chargement...", text = "Veuillez patienter") => {
  return MySwal.fire({
    ...baseOptions,
    title,
    text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Affiche une alerte de succès
const success = (title = "Succès", text = "Opération réussie") => {
  return MySwal.fire({
    ...baseOptions,
    icon: "success",
    title,
    text,
    confirmButtonText: "Fermer",
  });
};

// Affiche une alerte d'erreur
const error = (title = "Erreur", text = "Une erreur est survenue") => {
  return MySwal.fire({
    ...baseOptions,
    icon: "error",
    title,
    text,
    confirmButtonText: "Fermer",
  });
};

// Affiche une alerte personnalisée
const custom = (options = {}) => {
  return MySwal.fire({
    ...baseOptions,
    ...options,
  });
};

// Regroupe les fonctions dans un objet exportable
const SwalHelper = {
  loading,
  success,
  error,
  custom,
};

// Affiche une alerte de confirmation
const confirm = (
  title = "Êtes-vous sûr ?",
  text = "Cette action est irréversible.",
  confirmButtonText = "Oui, continuer"
) => {
  return MySwal.fire({
    ...baseOptions,
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Annuler",
  });
};

SwalHelper.confirm = confirm;

export default SwalHelper;
