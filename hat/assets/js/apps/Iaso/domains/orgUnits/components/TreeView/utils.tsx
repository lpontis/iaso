import React from 'react';
import OrgUnitTooltip from '../OrgUnitTooltip';
import { getOrgUnitAncestors } from '../../utils';

const formatInitialSelectedIds = orgUnits => {
    if (!orgUnits) return [];
    if (!Array.isArray(orgUnits)) return orgUnits.id.toString();
    return orgUnits.map(orgUnit => orgUnit.id.toString());
};
const formatInitialSelectedParents = (orgUnits) :Map<string,Map<string,string>> => {
    const parents:Map<string,Map<string,string>> = new Map();
    if (!orgUnits) return parents;
    if (!Array.isArray(orgUnits)) {
        parents.set(orgUnits.id.toString(), getOrgUnitAncestors(orgUnits));
    }
    if (Array.isArray(orgUnits)) {
        orgUnits.forEach(orgUnit => {
            parents.set(orgUnit.id.toString(), getOrgUnitAncestors(orgUnit));
        });
    }
    return parents;
};

const tooltip = (orgUnit, icon) => (
    <OrgUnitTooltip orgUnit={orgUnit} enterDelay={0} enterNextDelay={0}>
        {icon}
    </OrgUnitTooltip>
);

const adaptMap = (value:Map<string,Map<string,string>>|null) :string[]|null => {
    if (!value) return null;
    return Array.from(value.entries()) // original map in array form [[key1, entry1],[key2, entry2]]
        .map((entry:[string,Map<string,string>]) => Array.from(entry[1].keys())) // 2D array containing the keys of each entry from comment above: [[entry1Key1, entry1Key2],[entry2Key1,entry2Key2]]
        .map(
            keys =>
                keys
                    .filter(
                        (key, _index, keyArray) =>
                            key !== keyArray[keyArray.length - 1],
                    ), // removing last entry in the array to avoid expanding it
        )
        .flat();
};

export {
    formatInitialSelectedIds,
    formatInitialSelectedParents,
    tooltip,
    adaptMap,
};