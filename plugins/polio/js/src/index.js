import 'core-js/stable';
import 'regenerator-runtime/runtime';

import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from './styles/theme';

import { Dashboard } from './components/Dashboard';

import { Router, Route, browserHistory } from 'react-router';
import React from 'react';

const queryClient = new QueryClient();

const Wrapper = ({ children }) => {
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

ReactDOM.render(
    <Wrapper>
        <Router history={browserHistory}>
            <Route path={'/polio'} component={Dashboard} />
        </Router>
    </Wrapper>,
    document.getElementById('root'),
);
