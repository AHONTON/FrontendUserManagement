import React, { useState } from "react";

const SettingsForm = ({ currentTheme, onChangeLanguage, onChangeTheme, onDeleteAccount }) => {
  const [language, setLanguage] = useState("fr");
  const [theme, setThemeLocal] = useState(currentTheme ? "dark" : "light"); // initialisé au theme actuel

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setThemeLocal(newTheme);
    onChangeTheme(newTheme === "dark"); // <-- on envoie un booléen au ThemeContext
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Langue</label>
        <select
          value={language}
          onChange={(e) => { setLanguage(e.target.value); onChangeLanguage(e.target.value); }}
          className="w-full px-3 py-2 mt-1 border rounded-md outline-none dark:bg-gray-700 dark:text-white"
        >
          <option value="fr">Français</option>
          <option value="en">Anglais</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Thème</label>
        <select
          value={theme}
          onChange={handleThemeChange}
          className="w-full px-3 py-2 mt-1 border rounded-md outline-none dark:bg-gray-700 dark:text-white"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button
        onClick={onDeleteAccount}
        className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
      >
        Supprimer le compte
      </button>
    </div>
  );
};

export default SettingsForm;
