import React from 'react';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import TopBar from '../components/nav/TopBarComponent';

const icons = {
    list: props => <FormatListBulleted {...props} />, // TODO: maybe pass this one directly from plugin
};

export const getPluginConfig = async () => {
    let pluginConfig = {
        menuItems: [],
        routes: [],
    };

    if (!process.env.POLIO_ENABLED) {
        return pluginConfig;
    }

    try {
        pluginConfig = await import('polio/config'); // TODO: find a way to have multiple plugins
        let routes = pluginConfig.routes ?? [];
        routes = routes.map(r => {
            const newRoute = {
                ...r,
                component: props => (
                    <>
                        <TopBar title={r.label} displayBackButton={false} />
                        {r.component(props)}
                    </>
                ),
            };
            return newRoute;
        });

        let { menuItems } = pluginConfig;
        menuItems = menuItems.map(menuItem => {
            return {
                ...menuItem,
                icon: props => icons[menuItem.icon](props),
            };
        });
        return {
            ...pluginConfig,
            menuItems,
            routes,
        };
    } catch (error) {
        console.warn('module not found');
        return pluginConfig;
    }
};
