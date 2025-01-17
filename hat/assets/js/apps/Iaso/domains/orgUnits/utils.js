import React from 'react';
import { textPlaceholder, useSafeIntl } from 'bluesquare-components';
import OrgUnitPopupComponent from './components/OrgUnitPopupComponent';
import MarkersListComponent from '../../components/maps/markers/MarkersListComponent';
import {
    circleColorMarkerOptions,
    orderOrgUnitsByDepth,
} from '../../utils/mapUtils';

import MESSAGES from './messages';

export const getPolygonPositionsFromSimplifiedGeom = field => {
    // FIXME We should use a proper lib for this
    const positionsArrays = field
        .split('(((')[1]
        .replace(')))', '')
        .replace(/, /gi, ',')
        .split(',');
    const polygonPositions = [];
    positionsArrays.forEach(pos => {
        const lat = pos.split(' ')[0];
        const lng = pos.split(' ')[1];
        polygonPositions.push([lng, lat]);
    });
    return polygonPositions;
};

export const fetchLatestOrgUnitLevelId = levels => {
    if (levels) {
        const levelsIds = levels.split(',');
        const latestId = parseInt(levelsIds[levelsIds.length - 1], 10);
        return latestId;
    }
    return null;
};

export const getOrgUnitsTree = orgUnit => {
    let tree = [orgUnit];
    const orgUnitLoop = (parent, tempTree) => {
        let treeCopy = [parent, ...tempTree];
        if (parent.parent) {
            treeCopy = orgUnitLoop(parent.parent, treeCopy);
        }
        return treeCopy;
    };

    if (orgUnit.parent) {
        tree = orgUnitLoop(orgUnit.parent, tree);
    }
    return tree;
};

export const getAliasesArrayFromString = aliasString =>
    aliasString.replace('[', '').replace(']', '').replace(/"/gi, '').split(',');

export const getSourcesWithoutCurrentSource = (
    sourcesList,
    currentSourceId,
) => {
    const sources = [];
    sourcesList.forEach(s => {
        if (s.id !== currentSourceId) {
            sources.push(s);
        }
    });
    return sources;
};

export const orgUnitLabelString = (orgUnit, withType, formatMessage) => {
    let message = textPlaceholder;
    if (orgUnit && orgUnit.name) {
        message = orgUnit.name;
        if (orgUnit.source) {
            message += ` - ${formatMessage(MESSAGES.sourceLower)}: ${
                orgUnit.source
            }`;
        }
        if (orgUnit.org_unit_type_name && withType) {
            message += ` (${orgUnit.org_unit_type_name})`;
        }
    }
    return message;
};

export const OrgUnitLabel = ({ orgUnit, withType }) => {
    const intl = useSafeIntl();
    return orgUnitLabelString(orgUnit, withType, intl.formatMessage);
};

const mapOrgUnitBySearch = (orgUnits, searches) => {
    const mappedOrgunits = [];
    searches.forEach((search, i) => {
        mappedOrgunits[i] = orgUnits.filter(o => o.search_index === i);
    });
    return mappedOrgunits;
};

export const mapOrgUnitByLocation = (orgUnits, searches) => {
    let shapes = orgUnits.filter(o => Boolean(o.geo_json));
    let locations = orgUnits.filter(o => Boolean(o.latitude && o.longitude));
    shapes = orderOrgUnitsByDepth(shapes);
    locations = orderOrgUnitsByDepth(locations);
    const mappedOrgunits = {
        shapes,
        locations,
    };
    mappedOrgunits.locations = mapOrgUnitBySearch(
        mappedOrgunits.locations,
        searches,
    );
    return mappedOrgunits;
};

export const getColorsFromParams = params => {
    const searches = JSON.parse(params.searches);
    return searches.map(s => s.color);
};

export const decodeSearch = search => {
    return JSON.parse(search);
};

export const encodeUriSearches = searches => {
    const newSearches = [...searches];
    newSearches.forEach((s, i) => {
        Object.keys(s).forEach(key => {
            const value = s[key];
            newSearches[i][key] =
                key === 'search' ? encodeURIComponent(value) : value;
        });
    });
    return JSON.stringify(newSearches);
};

export const encodeUriParams = params => {
    const searches = encodeUriSearches([...decodeSearch(params.searches)]);
    const newParams = {
        ...params,
        searches,
    };
    return newParams;
};

export const getOrgUnitParents = orgUnit => {
    if (!orgUnit.parent) return [];
    return [orgUnit.parent, ...getOrgUnitParents(orgUnit.parent)];
};

export const getOrgUnitParentsString = orgUnit =>
    getOrgUnitParents(orgUnit)
        .map(ou => (ou.name !== '' ? ou.name : ou.org_unit_type_name))
        .reverse()
        .join(' > ');

export const getOrgUnitParentsIds = orgUnit =>
    getOrgUnitParents(orgUnit)
        .map(ou => ou.id)
        .reverse();

const getOrgUnitsParentsUntilRoot = (orgUnit, parents = []) => {
    let parentsList = [...parents];
    parentsList.push(orgUnit);
    if (orgUnit.parent) {
        parentsList = getOrgUnitsParentsUntilRoot(orgUnit.parent, parentsList);
    }
    return parentsList;
};

export const getOrgUnitAncestorsIds = orgUnit => {
    const result = getOrgUnitParentsIds(orgUnit);
    // Adding id of the org unit in case it's a root
    // and to be able to select it with the treeview
    result.push(orgUnit.id);
    return result;
};

export const getOrgUnitAncestors = orgUnit => {
    const result = new Map(
        getOrgUnitsParentsUntilRoot(orgUnit)
            .map(parent => [parent.id, parent.name])
            .reverse(),
    );
    return result;
};

export const getStatusMessage = (status, formatMessage) => {
    switch (status) {
        case 'NEW': {
            return formatMessage(MESSAGES.new);
        }
        case 'REJECTED': {
            return formatMessage(MESSAGES.rejected);
        }
        default:
            return formatMessage(MESSAGES.validated);
    }
};

export const getOrgUnitGroups = orgUnit => (
    <span>
        {orgUnit.groups &&
            orgUnit.groups.length > 0 &&
            orgUnit.groups.map(g => g.name).join(', ')}
        {(!orgUnit.groups || orgUnit.groups.length === 0) && textPlaceholder}
    </span>
);

export const getMarkerList = (
    locationsList,
    fetchDetail,
    color,
    keyId,
    PopupComponent = OrgUnitPopupComponent,
) => (
    <MarkersListComponent
        key={keyId}
        items={locationsList}
        onMarkerClick={fetchDetail}
        PopupComponent={PopupComponent}
        popupProps={{
            displayUseLocation: true,
            useLocation: selectedOrgUnit =>
                this.useOrgUnitLocation(selectedOrgUnit),
        }}
        isCircle
        markerProps={() => ({
            ...circleColorMarkerOptions(color),
        })}
    />
);
