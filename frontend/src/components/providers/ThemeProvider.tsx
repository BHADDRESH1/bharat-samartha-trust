// src/components/providers/ThemeProvider.tsx
'use client';

// // OPTION 1: For next-themes
// import { ThemeProvider as NextThemesProvider } from 'next-themes';
// export function ThemeProvider({ children }) {
//   return <NextThemesProvider attribute="class">{children}</NextThemesProvider>;
// }

// OPTION 2: For styled-components
// import { ThemeProvider as StyledThemeProvider } from 'styled-components';
// const theme = { /* your theme object */ };
// export function ThemeProvider({ children }) {
//   return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
// }

// OPTION 3: For Material UI
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
const theme = createTheme();
export function ThemeProvider({ children }) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}