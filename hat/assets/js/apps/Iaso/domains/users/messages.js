import { defineMessages } from 'react-intl';

const MESSAGES = defineMessages({
    users: {
        defaultMessage: 'Users',
        id: 'iaso.label.users',
    },
    create: {
        defaultMessage: 'Create user',
        id: 'iaso.users.create',
    },
    userName: {
        defaultMessage: 'User name',
        id: 'iaso.label.userName',
    },
    firstName: {
        defaultMessage: 'First name',
        id: 'iaso.label.firstName',
    },
    lastName: {
        defaultMessage: 'Last name',
        id: 'iaso.label.lastName',
    },
    email: {
        defaultMessage: 'Email',
        id: 'iaso.label.email',
    },
    newPassword: {
        defaultMessage: 'New password',
        id: 'iaso.users.newPassword',
    },
    password: {
        defaultMessage: 'Password',
        id: 'iaso.users.password',
    },
    permissions: {
        defaultMessage: 'Permissions',
        id: 'iaso.users.permissions',
    },
    isSuperUser: {
        defaultMessage: 'User is a super admin and has all rights',
        id: 'iaso.users.isSuperUser',
    },
    search: {
        defaultMessage: 'Search',
        id: 'iaso.search',
    },
    infos: {
        defaultMessage: 'Infos',
        id: 'iaso.orgUnits.infos',
    },
    location: {
        defaultMessage: 'location',
        id: 'iaso.map.location',
    },
    cancel: {
        id: 'iaso.label.cancel',
        defaultMessage: 'Cancel',
    },
    save: {
        id: 'iaso.label.save',
        defaultMessage: 'Save',
    },
    selectedOrgUnits: {
        id: 'iaso.users.selectedOrgUnits',
        defaultMessage: 'Org units selected',
    },
    actions: {
        defaultMessage: 'Action(s)',
        id: 'iaso.label.actions',
    },
    edit: {
        defaultMessage: 'Edit',
        id: 'iaso.label.edit',
    },
    updateUser: {
        defaultMessage: 'Update user',
        id: 'iaso.users.update',
    },
    deleteUserTitle: {
        id: 'iaso.users.dialog.deleteUserTitle',
        defaultMessage: 'Are you sure you want to delete this user?',
    },
    deleteUserText: {
        id: 'iaso.users.dialog.deleteUserText',
        defaultMessage: 'This operation cannot be undone.',
    },
    addOrgUnit: {
        defaultMessage: 'Search org unit to add',
        id: 'iaso.orgUnits.add',
    },
    locale: {
        defaultMessage: 'Language',
        id: 'iaso.users.dialog.locale',
    },
    searchUser: {
        id: 'iaso.users.filter.searchUser',
        defaultMessage: 'Search user',
    },
    chooseLocation: {
        id: 'iaso.users.dialog.chooseLocation',
        defaultMessage: 'Select location(s)',
    },
    iaso_completeness: {
        id: 'iaso.permissions.completeness',
        defaultMessage: 'Complétude des données',
    },
    iaso_mappings: {
        id: 'iaso.permissions.mappings',
        defaultMessage: 'Correspondances avec DHIS2',
    },
    iaso_polio: {
        id: 'iaso.permissions.polio',
        defaultMessage: 'Polio campaign management',
    },
    iaso_links: {
        id: 'iaso.permissions.links',
        defaultMessage: 'Correspondances sources',
    },
    iaso_forms: { id: 'iaso.permissions.forms', defaultMessage: 'Formulaires' },
    iaso_pages: { id: 'iaso.permissions.pages', defaultMessage: 'Pages' },
    iaso_projects: {
        id: 'iaso.permissions.projects',
        defaultMessage: 'Projets',
    },
    iaso_sources: { id: 'iaso.permissions.sources', defaultMessage: 'Sources' },
    iaso_data_tasks: {
        id: 'iaso.permissions.dataTasks',
        defaultMessage: 'Tâches',
    },
    iaso_org_units: {
        id: 'iaso.permissions.orgUnits',
        defaultMessage: "Unités d'organisation",
    },
    iaso_users: {
        id: 'iaso.permissions.users',
        defaultMessage: 'Utilisateurs',
    },
});

export default MESSAGES;
