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
    try {
        pluginConfig = await import('test_app/pluginConfig'); // TODO find way to unse variable here
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
        console.error('module not found: ' + 'test_app/pluginConfigs');
        return pluginConfig;
    }
};
