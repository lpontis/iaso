import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { useSafeIntl } from 'bluesquare-components';

import { setForms } from './actions';
import { fetchAllProjects } from '../projects/actions';
import { fetchAllOrgUnitTypes } from '../orgUnits/types/actions';
import { redirectTo } from '../../routing/actions';

import { useSafeParams } from '../../hooks/useSafeParams';

import formsTableColumns from './config';
import archivedFormsTableColumns from './configArchived';

import TopBar from '../../components/nav/TopBarComponent';
import AddButtonComponent from '../../components/buttons/AddButtonComponent';
import SingleTable from '../../components/tables/SingleTable';
import { deleteForm, restoreForm, fetchForms } from '../../utils/requests';

import MESSAGES from './messages';

import { baseUrls } from '../../constants/urls';
import { formsFilters } from '../../constants/filters';
import { formsPath } from '../../constants/routes';

const Forms = ({ showOnlyDeleted }) => {
    const baseUrl = showOnlyDeleted ? baseUrls.archived : baseUrls.forms;
    const params = useSafeParams(formsPath.params, baseUrl);
    console.log('params', params);
    const intl = useSafeIntl();
    const dispatch = useDispatch();
    const [forceRefresh, setForceRefresh] = useState(false);
    const handleDeleteForm = formId =>
        deleteForm(dispatch, formId).then(() => {
            setForceRefresh(true);
        });
    const handleRestoreForm = formId =>
        restoreForm(dispatch, formId).then(() => {
            setForceRefresh(true);
        });
    const columnsConfig = showOnlyDeleted
        ? archivedFormsTableColumns(intl.formatMessage, handleRestoreForm)
        : formsTableColumns(
              intl.formatMessage,
              null,
              true,
              true,
              handleDeleteForm,
          );
    const reduxPage = useSelector(state => state.forms.formsPage);

    useEffect(() => {
        dispatch(fetchAllProjects());
        dispatch(fetchAllOrgUnitTypes());
    }, []);

    return (
        <>
            <TopBar title={intl.formatMessage(MESSAGES.title)} />
            <SingleTable
                baseUrl={baseUrl}
                endPointPath="forms"
                dataKey="forms"
                params={params}
                apiParams={{
                    ...params,
                    all: true,
                    only_deleted: showOnlyDeleted ? 1 : 0,
                }}
                fetchItems={fetchForms}
                defaultSorted={[{ id: 'instance_updated_at', desc: false }]}
                columns={columnsConfig}
                hideGpkg
                defaultPageSize={50}
                onDataLoaded={({ list, count, pages }) => {
                    dispatch(setForms(list, count, pages));
                }}
                forceRefresh={forceRefresh}
                onForceRefreshDone={() => setForceRefresh(false)}
                results={reduxPage}
                extraComponent={
                    !showOnlyDeleted && (
                        <AddButtonComponent
                            onClick={() => {
                                dispatch(
                                    redirectTo(baseUrls.formDetail, {
                                        formId: '0',
                                    }),
                                );
                            }}
                        />
                    )
                }
                toggleActiveSearch
                searchActive
                filters={formsFilters()}
            />
        </>
    );
};

Forms.propTypes = {
    showOnlyDeleted: PropTypes.bool,
};

Forms.defaultProps = {
    showOnlyDeleted: false,
};

export default Forms;
