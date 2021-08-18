import { createContext } from 'react';
import pluginsConfigs from '../../../../../../plugins';

export const capitalize = (text, keepEndCase = false) =>
    text
        .split(' ')
        .map(
            word =>
                word.slice(0, 1).toUpperCase() +
                (keepEndCase ? word.slice(1) : word.slice(1).toLowerCase()),
        )
        .join(' ');

export const formatThousand = number => {
    if (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return '0';
};

export const getYears = (yearsCount, offset = 0, reverse = false) => {
    const currentYear = new Date().getFullYear() + offset;
    const years = Array(yearsCount)
        .fill(null)
        .map((y, i) => currentYear - i);
    if (reverse) {
        return years.reverse();
    }
    return years;
};

export const addPositionIndex = array => {
    const tempArray:any[] = [];
    if (array) {
        array.forEach((e, index) => {
            tempArray.push({
                value: e,
                position: index,
            });
        });
    }
    return tempArray;
};

export const removePositionIndex = array => {
    const tempArray :any[] = [];
    if (array) {
        array.forEach((e:any) => {
            tempArray.push(e.value)
        });
    }
    return tempArray;
};

export const userHasPermission = (
    permissions,
    currentUser,
    permissionKey,
    allowSuperUser = true,
) => {
    let hasPermission = false;
    if (
        currentUser &&
        permissions &&
        Object.getOwnPropertyNames(currentUser).length !== 0 &&
        permissions.length > 0
    ) {
        const currentPermission = permissions.find(
            p => p.codename === permissionKey,
        );
        // TODO: the API is now filtering the user permissions list so the second .find below is unnecessary
        if (
            (currentUser.is_superuser && allowSuperUser) ||
            (currentPermission &&
                currentUser.permissions.find(p => p === currentPermission.id))
        ) {
            hasPermission = true;
        }
    }
    return hasPermission;
};

export const getIntegerArray = size =>
    Array(size)
        .fill(null)
        .map((y, i) => size - i)
        .reverse();

export const getPlugins = (pluginsKeys : any[]):any[] =>  {
    const plugins :any[] = [];
    pluginsKeys.forEach(plugin => {
        const pluginConfig = pluginsConfigs[plugin];
        if (pluginConfig) {
            plugins.push(pluginConfig);
        }
    });
    return plugins;
};
const emptyArray :any[] = [];
export const PluginsContext = createContext({ plugins: emptyArray });