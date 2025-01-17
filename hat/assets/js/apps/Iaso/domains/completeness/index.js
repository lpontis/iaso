import React from 'react';
import PropTypes from 'prop-types';
import { LoadingSpinner, useSafeIntl } from 'bluesquare-components';
import TopBar from '../../components/nav/TopBarComponent';
import CompletenessListComponent from './components/CompletenessListComponent';

import MESSAGES from './messages';
import { getRequest } from '../../libs/Api';
import snackMessages from '../../components/snackBars/messages';
import { useSnackQuery } from '../../libs/apiHooks';

const Completeness = ({ params }) => {
    const { formatMessage } = useSafeIntl();
    const { data = [], isFetching } = useSnackQuery(
        ['completeness'],
        () => getRequest('/api/completeness/').then(res => res.completeness),
        snackMessages.fetchCompletenessError,
    );

    return (
        <>
            {isFetching && <LoadingSpinner />}
            <TopBar
                title={formatMessage(MESSAGES.completeness)}
                displayBackButton={false}
            />

            <CompletenessListComponent
                completenessList={data}
                params={params}
            />
        </>
    );
};

Completeness.propTypes = {
    params: PropTypes.object.isRequired,
};

export default Completeness;
