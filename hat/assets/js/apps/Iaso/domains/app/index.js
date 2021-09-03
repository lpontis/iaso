import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Link } from 'react-router-dom';
import { Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { SnackbarProvider } from 'notistack';
import { LinkProvider } from 'bluesquare-components';
import SnackBarContainer from '../../components/snackBars/SnackBarContainer';
import LocalizedApp from './components/LocalizedAppComponent';

export default function App({ store, routes, history }) {
    return (
        <Provider store={store}>
            <LocalizedApp>
                <LinkProvider linkComponent={Link}>
                    <SnackbarProvider
                        maxSnack={3}
                        autoHideDuration={4000}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                    >
                        <SnackBarContainer />
                        <ConnectedRouter history={history}>
                            <Switch>{routes}</Switch>
                        </ConnectedRouter>
                    </SnackbarProvider>
                </LinkProvider>
            </LocalizedApp>
        </Provider>
    );
}
App.propTypes = {
    store: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
};
