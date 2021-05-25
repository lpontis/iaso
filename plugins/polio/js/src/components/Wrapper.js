import React from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from '../styles/theme';
import { CssBaseline } from '@material-ui/core';

const queryClient = new QueryClient();

export const Wrapper = ({ children }) => {
    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <MuiThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </MuiThemeProvider>
            </QueryClientProvider>
        </React.StrictMode>
    );
};
