import React from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router';
import IconButtonComponent from '../../components/buttons/IconButtonComponent';
import ColumnTextComponent from '../../components/tables/ColumnTextComponent';
import { textPlaceholder } from '../../constants/uiConstants';
import MESSAGES from './messages';
import { restoreForm, fetchForms } from '../../utils/requests';
import { setForms, setIsLoadingForm } from './actions';

const archivedTableColumn = formatMessage => [
    {
        Header: formatMessage(MESSAGES.name),
        accessor: 'name',
        Cell: settings => <ColumnTextComponent text={settings.original.name} />,
    },
    {
        Header: formatMessage(MESSAGES.form_id),
        sortable: false,
        Cell: settings => (
            <ColumnTextComponent
                text={settings.original.form_id || textPlaceholder}
            />
        ),
    },
    {
        Header: formatMessage(MESSAGES.type),
        sortable: false,
        accessor: 'org_unit_types',
        Cell: settings => (
            <ColumnTextComponent
                text={settings.original.org_unit_types
                    .map(o => o.short_name)
                    .join(', ')}
            />
        ),
    },
    {
        Header: formatMessage(MESSAGES.records),
        accessor: 'instances_count',
        Cell: settings => (
            <ColumnTextComponent text={settings.original.instances_count} />
        ),
    },
    {
        Header: formatMessage(MESSAGES.latest_version_files),
        sortable: false,
        Cell: settings =>
            settings.original.latest_form_version !== null && (
                <Grid container spacing={1} justify="center">
                    <Grid item>
                        <ColumnTextComponent
                            text={
                                settings.original.latest_form_version.version_id
                            }
                        />
                    </Grid>
                    <Grid container spacing={1} justify="center">
                        {settings.original.latest_form_version.xls_file && (
                            <Grid item>
                                <Link
                                    download
                                    href={
                                        settings.original.latest_form_version
                                            .xls_file
                                    }
                                >
                                    XLS
                                </Link>
                            </Grid>
                        )}
                        <Grid item>
                            <Link
                                download
                                href={
                                    settings.original.latest_form_version.file
                                }
                            >
                                XML
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            ),
    },
    {
        Header: formatMessage(MESSAGES.created_at),
        accessor: 'created_at',
        Cell: settings => (
            <ColumnTextComponent
                text={moment
                    .unix(settings.original.created_at)
                    .format('DD/MM/YYYY HH:mm')}
            />
        ),
    },
    {
        Header: formatMessage(MESSAGES.updated_at),
        accessor: 'updated_at',
        Cell: settings => (
            <ColumnTextComponent
                text={moment
                    .unix(settings.original.updated_at)
                    .format('DD/MM/YYYY HH:mm')}
            />
        ),
    },
    {
        Header: formatMessage(MESSAGES.deleted_at),
        accessor: 'deleted_at',
        Cell: settings => (
            <ColumnTextComponent
                text={moment
                    .unix(settings.original.deleted_at)
                    .format('DD/MM/YYYY HH:mm')}
            />
        ),
    },
    {
        Header: formatMessage(MESSAGES.actions),
        resizable: false,
        sortable: false,
        width: 150,
        Cell: settings => {
            return (
                <section>
                    <DispatchableRestoreButton form={settings.original} />
                </section>
            );
        },
    },
];

const DispatchableRestoreButton = ({ form }) => {
    const dispatch = useDispatch();

    return (
        <IconButtonComponent
            onClick={() => {
                restoreForm(dispatch, form.id).then(() => {
                    dispatch(setIsLoadingForm(true));
                    fetchForms(
                        dispatch,
                        '/api/forms/?&order=instance_updated_at&all=true&only_deleted=1',
                    ).then(result => {
                        dispatch(
                            setForms(result.forms, result.count, result.pages),
                        );
                        dispatch(setIsLoadingForm(false));
                    });
                });
            }}
            icon="restore-from-trash"
            tooltipMessage={MESSAGES.restoreFormTooltip}
        />
    );
};

export default archivedTableColumn;