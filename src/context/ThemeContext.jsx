import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES, THEME_CONFIGS } from '../themes/definitions';
import { sound } from '../utils/soundEffects';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('life_rpg_theme');
    return saved && THEME_CONFIGS[saved] ? saved : THEMES.FOREST;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    // Remove all existing theme classes
    root.classList.remove('theme-forest', 'theme-samurai', 'theme-city');
    // Add current theme class
    root.classList.add(`theme-${currentTheme}`);
    localStorage.setItem('life_rpg_theme', currentTheme);
  }, [currentTheme]);

  const switchTheme = (newTheme) => {
    if (newTheme === currentTheme || !THEME_CONFIGS[newTheme]) return;
    
    sound.playClick();
    setIsTransitioning(true);
    setCurrentTheme(newTheme);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  const themeConfig = THEME_CONFIGS[currentTheme];

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      themeConfig,
      switchTheme,
      allThemes: THEME_CONFIGS,
      isTransitioning
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
