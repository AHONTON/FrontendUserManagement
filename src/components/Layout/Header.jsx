import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Menu,
  Mail,
  Sun,
  Moon,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Modal from "./Modal";
import ProfileForm from "./ProfileForm";
import SettingsForm from "./SettingsForm";
import NotificationsList from "./NotificationsList";
import EmailsList from "./EmailsList";
import { useTheme } from "../contexts/ThemeContext";

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  }),
};

const mobileMenuVariants = {
  hidden: { opacity: 0, x: "100%", transition: { duration: 0.3 } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const searchVariants = {
  collapsed: { width: "40px" },
  expanded: { width: "100%" },
};

const Header = ({
  userEmail = "user@example.com",
  isOnline = true,
  avatarUrl = null,
  onLogout,
}) => {
  const { isDark, toggleTheme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const notifications = ["Nouvelle commande reçue", "Stock faible pour produit X"];
  const emails = [{ sender: "admin@site.com", subject: "Mise à jour de votre compte" }];

  const handleSearchFocus = () => setIsSearchExpanded(true);
  const handleSearchBlur = () => setIsSearchExpanded(false);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 z-50 flex items-center justify-between w-full px-4 py-3 bg-white border-b border-gray-200 shadow-lg sm:px-6 dark:bg-gray-900 dark:border-gray-700"
      >
        {/* Logo & mobile menu */}
        <motion.div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95, rotate: 15 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 rounded-xl hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.h1 className="text-xl font-bold text-transparent sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text dark:from-blue-400 dark:to-purple-400">
            MyDashboard
          </motion.h1>
        </motion.div>

        {/* Search desktop */}
        <motion.div className="items-center flex-1 hidden max-w-md mx-6 md:flex" layout>
          <motion.div
            variants={searchVariants}
            initial="collapsed"
            animate={isSearchExpanded ? "expanded" : "collapsed"}
            className="relative flex items-center w-full px-4 py-2 transition-all duration-300 bg-gray-100 border border-transparent rounded-full dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
          >
            <Search className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="w-full ml-3 text-sm placeholder-gray-500 bg-transparent outline-none dark:text-white dark:placeholder-gray-400"
            />
          </motion.div>
        </motion.div>

        {/* Actions */}
        <div className="items-center hidden space-x-2 lg:flex">
          {/* Email */}
          <motion.button onClick={() => setIsEmailModalOpen(true)} className="relative p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <motion.span className="absolute w-2 h-2 bg-blue-500 rounded-full top-2 right-2" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
          </motion.button>

          {/* Notifications */}
          <motion.button onClick={() => setIsNotifModalOpen(true)} className="relative p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <motion.span className="absolute w-2 h-2 bg-red-500 rounded-full top-2 right-2" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
          </motion.button>

          {/* Theme toggle */}
          <motion.button onClick={toggleTheme} className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </motion.button>
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <motion.button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center p-2 space-x-2 sm:space-x-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-10 h-10 border-2 border-gray-200 rounded-full shadow-lg dark:border-gray-700" />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-purple-600">
                {userEmail.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="items-center hidden space-x-2 sm:flex">
              <span className="text-sm font-medium truncate max-w-[120px] dark:text-white">{userEmail}</span>
              <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </motion.div>
            </div>
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 z-50 w-64 py-2 mt-2 bg-white border shadow-xl dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-2xl"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium dark:text-white">{userEmail}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{isOnline ? "En ligne" : "Hors ligne"}</p>
                </div>

                {[
                  { label: "Mon Profil", action: () => setIsProfileModalOpen(true), icon: <User className="w-4 h-4" /> },
                  { label: "Modifier Profil", action: () => setIsProfileModalOpen(true), icon: <User className="w-4 h-4" /> },
                  { label: "Paramètres", action: () => setIsSettingsModalOpen(true), icon: <Settings className="w-4 h-4" /> },
                  { label: "Déconnexion", action: onLogout, danger: true, icon: <LogOut className="w-4 h-4" /> },
                ].map((item, i) => (
                  <motion.button
                    key={i}
                    custom={i}
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.05)" }}
                    onClick={() => {
                      item.action();
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors ${
                      item.danger
                        ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Modals */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Modifier Profil">
        <ProfileForm onSubmit={(data) => console.log("Modifier Profil", data)} />
      </Modal>

      <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="Paramètres">
        <SettingsForm
          currentTheme={isDark}
          onChangeLanguage={(lang) => console.log("Langue", lang)}
          onChangeTheme={(dark) => setTheme(dark)}
          onDeleteAccount={() => console.log("Supprimer compte")}
        />
      </Modal>

      <Modal isOpen={isNotifModalOpen} onClose={() => setIsNotifModalOpen(false)} title="Notifications">
        <NotificationsList notifications={notifications} />
      </Modal>

      <Modal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} title="Messages">
        <EmailsList emails={emails} />
      </Modal>
    </>
  );
};

export default Header;
