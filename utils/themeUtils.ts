export const createTheme = (isDarkMode: boolean) => {
    return {
      isDarkMode,
      background: isDarkMode ? '#0f172a' : '#f8fafc',
      card: isDarkMode ? '#1e293b' : '#ffffff',
      text: isDarkMode ? '#ffffff' : '#0f172a',
      subtext: isDarkMode ? '#94a3b8' : '#64748b',
      border: isDarkMode ? '#334155' : '#e2e8f0',
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: isDarkMode ? '#fbbf24' : '#f59e0b',
      success: '#10b981',
      inactive: isDarkMode ? '#475569' : '#cbd5e1',
    };
  };