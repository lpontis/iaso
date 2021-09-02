import React from 'react';
import { Redirect } from 'react-router';
import { baseUrls } from '../constants/urls';
import { getChipColors } from '../constants/chipColors';

import { locationLimitMax } from '../domains/orgUnits/constants/orgUnitConstants';

const addRoutes = baseRoutes =>
    baseRoutes.concat([
        <Redirect from="/" to={baseUrls.forms} />,
        <Redirect
            from={baseUrls.orgUnits}
            to={`${
                baseUrls.orgUnits
            }/locationLimit/${locationLimitMax}/order/id/pageSize/50/page/1/searchTabIndex/0/searches/[{"validation_status":"all", "color":"${getChipColors(
                0,
            ).replace('#', '')}"}]`}
        />,
        <Redirect
            from={baseUrls.mappings}
            to={`${baseUrls.mappings}/order/form_version__form__name,form_version__version_id,mapping__mapping_type/pageSize/20/page/1`}
        />,
        <Redirect
            from={baseUrls.users}
            to={`${baseUrls.users}/order/user__username/pageSize/20/page/1`}
        />,
        <Redirect
            from={baseUrls.groups}
            to={`${baseUrls.groups}/order/name/pageSize/20/page/1`}
        />,
        <Redirect
            from={baseUrls.orgUnitTypes}
            to={`${baseUrls.orgUnitTypes}/order/name/pageSize/20/page/1`}
        />,
        <Redirect from="/*" to={baseUrls.error404} />,
    ]);

export { addRoutes };
