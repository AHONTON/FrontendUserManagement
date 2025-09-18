import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, User, HelpCircle, LogOut, ChevronDown, Bell, Settings, Building2, Zap } from "lucide-react";

const menuItems = [
  { label: "Accueil", icon: <Home className="w-5 h-5" />, path: "/dashboard" },
  { label: "Utilisateurs", icon: <Users className="w-5 h-5" />, path: "/users", badge: "12" },
  { label: "Mon compte", icon: <User className="w-5 h-5" />, path: "/profile" },
  { label: "Aide/Support", icon: <HelpCircle className="w-5 h-5" />, path: "/support" },
  { label: "Déconnexion", icon: <LogOut className="w-5 h-5" />, path: "/logout", isLogout: true }
];

const Sidebar = ({ collapsed = false }) => {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const sidebarVariants = {
    expanded: {
      width: 280,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    collapsed: {
      width: 80,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const itemVariants = {
    hover: {
      x: 4,
      transition: { duration: 0.2 }
    }
  };

  const badgeVariants = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial={collapsed ? "collapsed" : "expanded"}
      animate={collapsed ? "collapsed" : "expanded"}
      className="relative flex flex-col h-screen overflow-hidden border-r shadow-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-slate-700/50"
    >
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-600/5 to-purple-600/5" />
      
      {/* Header avec logo et branding */}
      <div className="relative px-6 py-6 border-b border-slate-700/50">
        <motion.div 
          className="flex items-center space-x-3"
          layout
        >
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <h1 className="text-lg font-bold text-white">Management</h1>
                <p className="text-xs text-slate-400">Dashboard</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Profil utilisateur section */}
      {!collapsed && (
        <motion.div 
          className="px-6 py-4 border-b border-slate-700/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center w-full p-3 transition-all duration-200 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full shadow-lg bg-gradient-to-br from-emerald-400 to-cyan-500">
              JD
            </div>
            <div className="flex-1 ml-3 text-left">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-slate-400">Administrateur</p>
            </div>
            <motion.div
              animate={{ rotate: userMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 transition-colors text-slate-400 group-hover:text-white" />
            </motion.div>
          </motion.button>
        </motion.div>
      )}

      {/* Navigation principale */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="mb-6">
          {!collapsed && (
            <motion.p 
              className="px-3 mb-3 text-xs font-semibold tracking-wider uppercase text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Navigation
            </motion.p>
          )}
          
          {menuItems.map((item, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover="hover"
              className="relative"
            >
              {item.isLogout ? (
                <motion.button
                  onClick={() => console.log("Déconnexion...")}
                  className="relative flex items-center w-full px-3 py-3 overflow-hidden transition-all duration-200 text-slate-300 hover:text-white group rounded-xl hover:bg-slate-800/50"
                  whileHover={{ backgroundColor: "rgba(248, 113, 113, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 transition-transform duration-300 translate-x-full bg-gradient-to-r from-red-500/0 to-red-500/10 group-hover:translate-x-0" />
                  <div className="relative z-10 flex items-center w-full">
                    <div className="text-red-400 group-hover:text-red-300">
                      {item.icon}
                    </div>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span 
                          className="ml-3 font-medium"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              ) : (
                <Link to={item.path}>
                  <motion.div
                    className={`flex items-center w-full px-3 py-3 transition-all duration-200 group rounded-xl relative overflow-hidden ${
                      location.pathname === item.path 
                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white shadow-lg border border-blue-500/30" 
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                    }`}
                    whileHover={{ 
                      backgroundColor: location.pathname === item.path 
                        ? "rgba(59, 130, 246, 0.25)" 
                        : "rgba(30, 41, 59, 0.5)" 
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {location.pathname === item.path && (
                      <motion.div 
                        className="absolute top-0 left-0 w-1 h-full rounded-r bg-gradient-to-b from-blue-400 to-purple-500"
                        layoutId="activeIndicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    <div className="absolute inset-0 transition-transform duration-300 translate-x-full bg-gradient-to-r from-blue-500/0 to-purple-500/10 group-hover:translate-x-0" />
                    
                    <div className="relative z-10 flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div className={location.pathname === item.path ? "text-blue-300" : ""}>
                          {item.icon}
                        </div>
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span 
                              className="ml-3 font-medium"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      {item.badge && !collapsed && (
                        <motion.div
                          variants={badgeVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full shadow-lg"
                        >
                          {item.badge}
                        </motion.div>
                      )}
                      
                      {item.badge && collapsed && (
                        <div className="absolute w-3 h-3 bg-blue-500 rounded-full shadow-lg -top-1 -right-1" />
                      )}
                    </div>
                  </motion.div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Footer avec actions rapides */}
      <div className="px-4 pb-6">
        {!collapsed ? (
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 p-3 transition-colors bg-slate-800/50 hover:bg-slate-700/50 rounded-xl group"
              >
                <Bell className="w-5 h-5 mx-auto transition-colors text-slate-400 group-hover:text-yellow-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 p-3 transition-colors bg-slate-800/50 hover:bg-slate-700/50 rounded-xl group"
              >
                <Settings className="w-5 h-5 mx-auto transition-colors text-slate-400 group-hover:text-blue-400" />
              </motion.button>
            </div>
            
            <div className="p-3 border bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-xl border-emerald-500/30">
              <div className="flex items-center mb-2 space-x-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">Statut Système</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-300">Tout fonctionne</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-full p-3 transition-colors bg-slate-800/50 hover:bg-slate-700/50 rounded-xl"
            >
              <Bell className="w-5 h-5 mx-auto transition-colors text-slate-400 hover:text-yellow-400" />
              <div className="absolute w-3 h-3 bg-yellow-500 rounded-full -top-1 -right-1" />
            </motion.button>
            <div className="w-full p-3 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-xl">
              <div className="w-2 h-2 mx-auto rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;