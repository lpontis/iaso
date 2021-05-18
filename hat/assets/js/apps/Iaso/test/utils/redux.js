import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { currentUserInitialState } from '../../redux/currentUserReducer';
import { formsInitialState } from '../../domains/forms/reducer';
import { orgUnitsInitialState } from '../../domains/orgUnits/reducer';
import { projectsInitialState } from '../../domains/projects/reducer';
import { mapInitialState } from '../../redux/mapReducer';
import { instancesInitialState } from '../../domains/instances/reducer';
import { mappingsInitialState } from '../../domains/mappings/reducer';
import { sidebarMenuInitialState } from '../../redux/sidebarMenuReducer';
import { snackBarsInitialState } from '../../redux/snackBarsReducer';
import { devicesInitialState } from '../../redux/devicesReducer';
import { orgUnitsLevelsInitialState } from '../../redux/orgUnitsLevelsReducer';
import { routerInitialState } from '../../redux/routerReducer';
import { linksInitialState } from '../../domains/links/reducer';
import { usersInitialState } from '../../domains/users/reducer';
import { periodsInitialState } from '../../domains/periods/reducer';
import { completenessInitialState } from '../../domains/completeness/reducer';
import { groupsInitialState } from '../../domains/orgUnits/groups/reducer';
import { orgUnitsTypesInitialState } from '../../domains/orgUnits/types/reducer';

import { renderWithIntl } from './intl';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const getMockedStore = storeObject => mockStore(storeObject);

const initialState = {
    load: {},
    currentUser: currentUserInitialState,
    sidebar: sidebarMenuInitialState,
    forms: formsInitialState,
    orgUnits: orgUnitsInitialState,
    instances: instancesInitialState,
    snackBar: snackBarsInitialState,
    map: mapInitialState,
    devices: devicesInitialState,
    orgUnitsLevels: orgUnitsLevelsInitialState,
    routerCustom: routerInitialState,
    links: linksInitialState,
    users: usersInitialState,
    periods: periodsInitialState,
    completeness: completenessInitialState,
    projects: projectsInitialState,
    mappings: mappingsInitialState,
    groups: groupsInitialState,
    orgUnitsTypes: orgUnitsTypesInitialState,
};

export const renderWithStore = (component, state = null) => (
    <Provider store={getMockedStore({ ...initialState, ...state })}>
        {renderWithIntl(component)}
    </Provider>
);
