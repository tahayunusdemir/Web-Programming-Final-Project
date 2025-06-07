import { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useThemeMode = () => {
    const [mode, setMode] = useState('light');
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                            // palette values for light mode
                            primary: { main: '#1976d2' },
                            secondary: { main: '#dc004e' },
                            background: {
                                default: '#f4f6f8',
                                paper: '#ffffff',
                            },
                        }
                        : {
                            // palette values for dark mode
                            primary: { main: '#90caf9' },
                            secondary: { main: '#f48fb1' },
                            background: {
                                default: '#121212',
                                paper: '#1e1e1e',
                            },
                        }),
                },
            }),
        [mode],
    );

    return [theme, colorMode];
}; 