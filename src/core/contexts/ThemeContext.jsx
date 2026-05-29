import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  // Landing siempre usa dark mode
  const [theme] = useState('dark');

  useEffect(() => {
    window.document.documentElement.classList.add('dark');
  }, []);

  const value = {
    theme,
    isDark: true,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
