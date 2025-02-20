// Save as: src/hooks/useTheme.ts
import { useState, useEffect, useCallback } from 'react';
import { Theme } from '@/types/components';

type ExtendedTheme = 'light' | 'dark' | 'system' | 'past' | 'future' | 'paradox';

// Custom theme definitions with CSS variables
const themeStyles: Record<ExtendedTheme, Record<string, string>> = {
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
  system: {}, // Handled dynamically below
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
  const [theme, setTheme] = useState<ExtendedTheme>('system');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Apply theme styles to document
  const applyTheme = useCallback((selectedTheme: ExtendedTheme) => {
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

    // Announce theme change for accessibility
    const liveRegion = document.getElementById('theme-announcer');
    if (liveRegion) {
      liveRegion.textContent = `Theme changed to ${selectedTheme}`;
    } else {
      const newLiveRegion = document.createElement('div');
      newLiveRegion.id = 'theme-announcer';
      newLiveRegion.setAttribute('aria-live', 'polite');
      newLiveRegion.setAttribute('class', 'sr-only');
      newLiveRegion.textContent = `Theme changed to ${selectedTheme}`;
      document.body.appendChild(newLiveRegion);
    }
  }, []);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ExtendedTheme | null;
    const initialTheme = savedTheme || 'system';
    setTheme(initialTheme);
    applyTheme(initialTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        setIsTransitioning(true);
        applyTheme('system');
        setTimeout(() => setIsTransitioning(false), 300);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [applyTheme, theme]);

  // Update theme
  const updateTheme = useCallback(
    (newTheme: ExtendedTheme) => {
      setIsTransitioning(true);
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
      setTimeout(() => setIsTransitioning(false), 300); // Match transition duration
    },
    [applyTheme]
  );

  return { theme, updateTheme, isTransitioning };
};

// Add to globals.css for smooth transitions
const additionalStyles = `
  :root {
    --background: #ffffff;
    --foreground: #1f2937;
    --card: #f9fafb;
    --card-foreground: #1f2937;
    --primary: #3b82f6;
    --border: #e5e7eb;
    --transition-duration: 300ms;
  }
  .dark {
    --background: #1f2937;
    --foreground: #f9fafb;
    --card: #374151;
    --card-foreground: #f9fafb;
    --primary: #60a5fa;
    --border: #4b5563;
  }
  html {
    transition: background-color var(--transition-duration) ease, color var(--transition-duration) ease;
    background-color: var(--background);
    color: var(--foreground);
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`;
