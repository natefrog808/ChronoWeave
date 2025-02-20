// src/hooks/useTheme.ts

import { useState, useEffect, useCallback } from 'react';

// Theme type definition
export type Theme = 'light' | 'dark' | 'system' | 'past' | 'future' | 'paradox';

// Theme styles configuration
const themeStyles: Record<Theme, Record<string, string>> = {
  light: {
    '--background': '#ffffff',
    '--foreground': '#1f2937',
    '--card': '#f9fafb',
    '--card-foreground': '#1f2937',
    '--primary': '#3b82f6',
    '--border': '#e5e7eb',
    '--transition-duration': '300ms',
  },
  dark: {
    '--background': '#1f2937',
    '--foreground': '#f9fafb',
    '--card': '#374151',
    '--card-foreground': '#f9fafb',
    '--primary': '#60a5fa',
    '--border': '#4b5563',
    '--transition-duration': '300ms',
  },
  system: {}, // Handled dynamically
  past: {
    '--background': '#fefce8',
    '--foreground': '#451a03',
    '--card': '#fef9c3',
    '--card-foreground': '#451a03',
    '--primary': '#d97706',
    '--border': '#d97706',
    '--transition-duration': '400ms',
  },
  future: {
    '--background': '#0f172a',
    '--foreground': '#e2e8f0',
    '--card': '#1e293b',
    '--card-foreground': '#e2e8f0',
    '--primary': '#22d3ee',
    '--border': '#334155',
    '--transition-duration': '200ms',
  },
  paradox: {
    '--background': '#1c2526',
    '--foreground': '#e0e7ff',
    '--card': '#2d3940',
    '--card-foreground': '#e0e7ff',
    '--primary': '#f43f5e',
    '--border': '#6b7280',
    '--transition-duration': '500ms',
  },
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('system');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Apply theme styles
  const applyTheme = useCallback((selectedTheme: Theme) => {
    const root = document.documentElement;
    const styles = themeStyles[selectedTheme] || {};

    if (selectedTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      Object.entries(themeStyles[systemDark ? 'dark' : 'light']).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      root.classList.toggle('dark', systemDark);
    } else {
      Object.entries(styles).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      root.classList.toggle('dark', selectedTheme === 'dark' || selectedTheme === 'future' || selectedTheme === 'paradox');
    }

    // Accessibility announcement
    const announceThemeChange = (themeName: string) => {
      const liveRegion = document.getElementById('theme-announcer') || (() => {
        const region = document.createElement('div');
        region.id = 'theme-announcer';
        region.setAttribute('aria-live', 'polite');
        region.setAttribute('class', 'sr-only');
        document.body.appendChild(region);
        return region;
      })();
      liveRegion.textContent = `Theme changed to ${themeName}`;
    };

    announceThemeChange(selectedTheme);
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || 'system';
    setTheme(initialTheme);
    applyTheme(initialTheme);

    // Handle system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        setIsTransitioning(true);
        applyTheme('system');
        setTimeout(() => setIsTransitioning(false), 300);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [applyTheme, theme]);

  // Theme update handler
  const updateTheme = useCallback((newTheme: Theme) => {
    setIsTransitioning(true);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [applyTheme]);

  return { theme, updateTheme, isTransitioning };
};

export default useTheme;
