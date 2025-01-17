import React from 'react';
import DataSourceIcon from '@material-ui/icons/ListAltTwoTone';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import SettingsIcon from '@material-ui/icons/Settings';
import CalendarToday from '@material-ui/icons/CalendarToday';
import { Dashboard } from './src/components/Dashboard';
import { Calendar } from './src/pages/Calendar';
import { CountryNotificationsConfig } from './src/components/CountryNotificationsConfig/CountryNotificationsConfig';
import MESSAGES from './src/constants/messages';
import fr from './src/constants/translations/fr.json';
import en from './src/constants/translations/en.json';

const routes = [
    {
        baseUrl: 'polio/list',
        component: () => <Dashboard />,
        permission: 'iaso_polio',
        params: [],
    },
    {
        baseUrl: 'polio/calendar',
        component: props => <Calendar {...props} />,
        permission: 'iaso_polio',
        params: [
            {
                isRequired: false,
                key: 'currentDate',
            },
        ],
    },
    {
        baseUrl: 'polio/config',
        component: () => <CountryNotificationsConfig />,
        permission: 'iaso_polio',
        params: [
            {
                isRequired: false,
                key: 'order',
            },
            {
                isRequired: false,
                key: 'page',
            },
            {
                isRequired: false,
                key: 'pageSize',
            },
        ],
    },
    {
        allowAnonymous: true,
        baseUrl: 'polio/embeddedCalendar',
        component: props => <Calendar {...props} embedded />,
        params: [
            {
                isRequired: false,
                key: 'currentDate',
            },
        ],
        isRootUrl: false,
    },
];

const menu = [
    {
        label: MESSAGES.polio,
        key: 'polio',
        icon: props => <DataSourceIcon {...props} />,
        subMenu: [
            {
                label: MESSAGES.campaigns,
                key: 'list',
                permission: 'iaso_polio',
                icon: props => <FormatListBulleted {...props} />,
            },
            {
                label: MESSAGES.calendar,
                key: 'calendar',
                permission: 'iaso_polio',
                icon: props => <CalendarToday {...props} />,
            },
            {
                label: MESSAGES.configuration,
                key: 'config',
                permission: 'iaso_polio',
                icon: props => <SettingsIcon {...props} />,
            },
        ],
    },
];

const translations = {
    fr,
    en,
};

export default {
    routes,
    menu,
    translations,
};
