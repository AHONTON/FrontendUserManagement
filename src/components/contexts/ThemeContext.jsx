import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Récupération du thème sauvegardé ou détection de la préférence système
    try {
      const savedTheme = sessionStorage.getItem('hse_theme')
      if (savedTheme) {
        setIsDark(savedTheme === 'dark')
      } else {
        // Détection de la préférence système si aucun thème n'est sauvegardé
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDark(systemPrefersDark)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du thème:', error)
      // Fallback sur la préférence système
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(systemPrefersDark)
    }
  }, [])

  useEffect(() => {
    // Application du thème au DOM
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Sauvegarde du thème
    try {
      sessionStorage.setItem('hse_theme', isDark ? 'dark' : 'light')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du thème:', error)
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const setTheme = (dark) => {
    setIsDark(dark)
  }

  // Exposer à la fois isDark et theme pour la compatibilité
  const value = {
    isDark,
    theme: isDark ? 'dark' : 'light', // Ajout de la propriété theme
    toggleTheme,
    setTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}