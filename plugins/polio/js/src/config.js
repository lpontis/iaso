import { Dashboard } from './components/Dashboard';

const baseUrl = `polio`;

const routes = [
    {
        label: 'Polio',
        baseUrl: baseUrl,
        permission: 'iaso_forms',
        component: Dashboard,
    },
];

const menuItems = [
    {
        label: 'Polio',
        permission: 'iaso_forms',
        key: 'polio',
        icon: 'list',
    },
];

export { routes, menuItems };
