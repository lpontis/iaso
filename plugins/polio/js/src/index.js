import 'core-js/stable';
import 'regenerator-runtime/runtime';

import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from './styles/theme';

import { Wrapper } from './components/Wrapper';
import { Dashboard } from './components/Dashboard';

const queryClient = new QueryClient();

ReactDOM.render(
    <Wrapper>
        <Dashboard />
    </Wrapper>,
    document.getElementById('root'),
);
