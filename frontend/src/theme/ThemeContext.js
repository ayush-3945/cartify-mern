import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeModeContext = createContext({
  mode: 'light',
  toggleTheme: () => {}
});

export const useThemeMode = () => useContext(ThemeModeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('cartify_theme_mode') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('cartify_theme_mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: mode,
        primary: {
          main: mode === 'dark' ? '#ff5252' : '#000000',
          light: mode === 'dark' ? '#ff7961' : '#ffffff',
          dark: '#DB4444',
          customBlack: '#191919'
        },
        background: {
          default: mode === 'dark' ? '#121212' : '#ffffff',
          paper: mode === 'dark' ? '#1e1e1e' : '#ffffff'
        },
        text: {
          primary: mode === 'dark' ? '#f5f5f5' : '#191919',
          secondary: mode === 'dark' ? '#aaaaaa' : '#666666'
        }
      },
      typography: {
        fontFamily: 'Poppins, sans-serif'
      },
      components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
              color: mode === 'dark' ? '#ffffff' : '#191919',
              borderBottom: mode === 'dark' ? '1px solid #2d2d2d' : '1px solid #f0f0f0'
            }
          }
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none'
            }
          }
        }
      }
    });
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
