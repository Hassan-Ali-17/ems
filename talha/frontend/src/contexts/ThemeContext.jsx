import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const themeColors = {
  dark: {
    primary: '#8b5cf6',
    primaryDark: '#6d28d9',
    primaryLight: '#a78bfa',
    secondary: '#ec4899',
    secondaryDark: '#be185d',
    secondaryLight: '#f472b6',
    background: '#0f0913',
    backgroundAlt: '#1a1320',
    panel: 'rgba(45, 27, 78, 0.5)',
    text: '#f5f3ff',
    textSecondary: '#e9d5ff',
    muted: '#c084fc',
    accent: '#d946ef',
  },
  light: {
    primary: '#7c3aed',
    primaryDark: '#5b21b6',
    primaryLight: '#c4b5fd',
    secondary: '#db2777',
    secondaryDark: '#9d174d',
    secondaryLight: '#ec4899',
    background: '#faf7ff',
    backgroundAlt: '#f3e8ff',
    panel: 'rgba(255, 255, 255, 0.95)',
    text: '#2d1b4e',
    textSecondary: '#4c1d95',
    muted: '#8b5cf6',
    accent: '#d946ef',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const colors = themeColors[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
