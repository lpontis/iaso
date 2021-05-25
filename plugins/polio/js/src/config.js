import { Dashboard } from './components/Dashboard';

const routes = [
    {
        label: 'Polio',
        baseUrl: 'polio',
        permission: 'iaso_forms',
        component: Dashboard,
    },
];

const menu = [
    {
        label: 'Polio',
        permission: 'iaso_forms',
        key: 'polio',
        icon: 'list',
    },
];

export { routes, menu };
