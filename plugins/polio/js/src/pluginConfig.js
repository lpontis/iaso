import React from 'react';
import { Dashboard } from './components/Dashboard';
import { Wrapper } from './components/Wrapper';

const routes = [
    {
        label: 'Polio dashboard',
        baseUrl: 'polio/dashboard',
        permission: 'iaso_forms', // use an existing permission
        component: props => (
            <Wrapper>
                <Dashboard {...props} />
            </Wrapper>
        ),
        params: [
            {
                isRequired: false,
                key: 'order',
            },
            {
                isRequired: false,
                key: 'pageSize',
            },
            {
                isRequired: false,
                key: 'page',
            },
        ],
    },
];

const menuItems = [
    {
        label: 'Plugin List',
        permission: 'iaso_forms',
        key: 'plugin/list',
        icon: 'list',
    },
];

export { routes, menuItems };
