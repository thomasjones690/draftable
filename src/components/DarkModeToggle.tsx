import React from 'react';
import { useEffect, useState } from 'react';

export const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  // Set dark mode on mount, regardless of toggle visibility
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Handle dark mode changes
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
    >
      {darkMode ? 'Light Mode 🌞' : 'Dark Mode 🌙'}
    </button>
  );
}; 