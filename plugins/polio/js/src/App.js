import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { routes } from './config';

const createRoute = route => {
    const { path, component: Component } = route;

    return (
        <Route path={path}>
            <Component />
        </Route>
    );
};

function App() {
    return (
        <Router>
            <div>
                <Switch>{routes.map(route => createRoute(route))}</Switch>
            </div>
        </Router>
    );
}

export default App;
