import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from './styles/theme';

const queryClient = new QueryClient();

ReactDOM.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </MuiThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
