import React, { createContext, useContext, useState } from 'react'

const LangContext = createContext()

export const useLang = () => {
  const context = useContext(LangContext)
  if (!context) {
    throw new Error('useLang must be used within a LangProvider')
  }
  return context
}

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('fr')

  const toggleLang = () => {
    setLang(prev => (prev === 'fr' ? 'en' : 'fr'))
  }

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  )
}

export { LangContext }
