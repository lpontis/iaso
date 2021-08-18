import { iasoGetRequest } from '../../../../utils/requests';

export type TreeViewData<T> = {
    id: string;
    name: string;
    hasChildren: boolean;
    data: T;
};

export interface OrgUnit {
    id: string;
    name: string;
    // eslint-disable-next-line camelcase
    has_children: boolean;
    parent: OrgUnit | null;
}

export interface OrgUnits {
    orgunits: OrgUnit[];
}

console.log("test");

const getChildrenData = async (
    id: string,
): Promise<TreeViewData<OrgUnit>[]> => {
    const response: OrgUnits = await iasoGetRequest({
        disableSuccessSnackBar: true,
        requestParams: {
            url: `/api/orgunits/?&parent_id=${id}&validation_status=all&treeSearch=true&ignoreEmptyNames=true`,
        },
    });
    const usableData :TreeViewData<OrgUnit>[] = response.orgunits.map((orgUnit: OrgUnit) => {
        return {
            id: orgUnit.id,
            name: orgUnit.name,
            hasChildren: orgUnit.has_children,
            data: orgUnit,
        };
    });
    return usableData;
};

const getRootData = async source => {
    const response = await iasoGetRequest({
        disableSuccessSnackBar: true,
        requestParams: {
            url: source
                ? `/api/orgunits/?&rootsForUser=true&source=${source}&validation_status=all&treeSearch=true&ignoreEmptyNames=true`
                : `/api/orgunits/?&rootsForUser=true&defaultVersion=true&validation_status=all&treeSearch=true&ignoreEmptyNames=true`,
        },
    });
    const usableData = response.orgunits.map(orgUnit => {
        return {
            id: orgUnit.id.toString(),
            name: orgUnit.name,
            hasChildren: orgUnit.has_children,
            data: orgUnit,
        };
    });
    return usableData;
};

/**
 * @param {string} searchValue
 * @param {number} resultsCount
 */
const searchOrgUnits = async (searchValue, resultsCount, source) => {
    const url = source
        ? `/api/orgunits/?searches=[{"validation_status":"all","search":"${searchValue}","source":${source}}]&order=name&page=1&limit=${resultsCount}&smallSearch=true`
        : `/api/orgunits/?searches=[{"validation_status":"all","search":"${searchValue}","defaultVersion":"true"}]&order=name&page=1&limit=${resultsCount}&smallSearch=true`;
    return iasoGetRequest({
        requestParams: { url },
        disableSuccessSnackBar: true,
        errorKeyMessage: 'Searching Org Units',
        consoleError: url,
    });
};

const getOrgUnit = orgUnitId =>
    iasoGetRequest({
        requestParams: { url: `/api/orgunits/${orgUnitId}` },
        disableSuccessSnackBar: true,
    });

export { getRootData, getChildrenData, searchOrgUnits, getOrgUnit };
