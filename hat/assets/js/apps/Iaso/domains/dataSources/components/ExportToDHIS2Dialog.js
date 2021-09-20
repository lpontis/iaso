import React, { useCallback, useRef, useEffect } from 'react';
import { Grid, Box, Divider, Typography, makeStyles } from '@material-ui/core';
import { useSafeIntl } from 'bluesquare-components';
import { useMutation } from 'react-query';
import ConfirmCancelDialogComponent from '../../../components/dialogs/ConfirmCancelDialogComponent';
import InputComponent from '../../../components/forms/InputComponent';
import { useFormState } from '../../../hooks/form';
import MESSAGES from '../messages';
import {
    useDataSourceVersions,
    useOrgUnitTypes,
    postToDHIS2,
    xlsPreview,
    useCredentials,
} from '../requests';
import { orgUnitStatusAsOptions } from '../../../constants/filters';
import {
    commaSeparatedIdsToArray,
    commaSeparatedIdsToStringArray,
} from '../../../utils/forms';
import { OrgUnitTreeviewModal } from '../../orgUnits/components/TreeView/OrgUnitTreeviewModal';

const style = theme => ({
    subTitle: {
        color: theme.palette.primary.main,
        fontWeight: 'bold',
    },
});
const useStyles = makeStyles(style);

const useFieldsToExport = () => {
    const { formatMessage } = useSafeIntl();
    return [
        { label: formatMessage(MESSAGES.name), value: 'name' },
        { label: formatMessage(MESSAGES.parent), value: 'parent' },
        { label: formatMessage(MESSAGES.shape), value: 'shape' },
        { label: formatMessage(MESSAGES.groups), value: 'groups' },
        { label: formatMessage(MESSAGES.location), value: 'location' },
    ];
};

const initialExportData = {
    source_version_id: null, // version id of the origin data source
    source_org_unit_id: null,
    source_org_unit_types_ids: [],
    source_status: null, // "New", "Validated" etc, cf orgunit search
    fields_to_export: [],
    ref_version_id: null, // version id of the target data source
    ref_top_org_unit_id: null,
    credentials: null, // TODO ask if credentials should be prefilled
};

const credentialsAsOptions = credentials => {
    if (!credentials) return [];
    return credentials.map(credential => ({
        label: credential.name,
        value: credential.id,
    }));
};
const convertFormStateToDict = formState => {
    const result = {};
    const fields = Object.keys(formState);
    fields.forEach(field => {
        result[field] = formState[field].value;
    });
    return result;
};

const formatSourceVersionLabel = (
    formatMessage,
    defaultVersionId,
    sourceVersion,
) => {
    const name = sourceVersion.name ?? 'Unnamed source';
    const version = formatMessage(MESSAGES.version);
    const number = sourceVersion.number.toString();
    const label = `${name} - ${version}: ${number}`;

    if (sourceVersion.id === defaultVersionId)
        return `${label} (${formatMessage(MESSAGES.default)})`;

    return label;
};

const refDataSourceVersionsAsOptions = ({
    versions,
    defaultVersionId,
    formatMessage,
}) => {
    if (!versions) return [];
    return versions.map(version => {
        return {
            label: formatSourceVersionLabel(
                formatMessage,
                defaultVersionId,
                version,
            ),
            value: version.id,
        };
    });
};

const dataSourceVersionsAsOptions = (
    versions,
    defaultVersionId,
    formatMessage,
) => {
    const asDefault = `(${formatMessage(MESSAGES.default)})`;
    return versions.map(version => {
        const versionNumber = version.number.toString();
        return {
            value: version.id,
            label:
                version.id === defaultVersionId
                    ? `${versionNumber} ${asDefault}`
                    : versionNumber,
        };
    });
};

export const ExportToDHIS2Dialog = ({
    renderTrigger,
    dataSourceId,
    dataSourceName,
    versions,
    defaultVersionId,
}) => {
    const { formatMessage } = useSafeIntl();
    const classes = useStyles();
    const fieldsToExport = useFieldsToExport();

    const { data: orgUnitTypes, isLoading: areOrgUnitTypesLoading } =
        useOrgUnitTypes();

    const { data: sourceVersions, isLoading: areSourceVersionsLoading } =
        useDataSourceVersions(defaultVersionId);
    const { data: credentials, isLoading: areCredentialsLoading } =
        useCredentials(dataSourceId);
    const { mutate: exportToDHIS2 } = useMutation(postToDHIS2);
    const { mutate: preview } = useMutation(xlsPreview);
    const [
        exportData,
        setExportDataField,
        _setExportDataErrors,
        setExportData,
    ] = useFormState(initialExportData);

    const destinationDataVersionId = exportData.ref_version_id.value;

    // this ref to enable resetting the treeview when datasource changes
    const treeviewResetControl = useRef(destinationDataVersionId);

    const onTargetSourceVersionChange = useCallback(
        (keyValue, value) => {
            setExportDataField(keyValue, value?.toString());
        },
        [setExportDataField],
    );

    const reset = useCallback(() => {
        setExportData(initialExportData);
    }, [setExportData]);

    const onXlsPreview = useCallback(() => {
        console.log("I'm an XLS Preview, I can do sums and graphs and stuff");
        preview(convertFormStateToDict(exportData));
    }, [exportData, preview]);

    const onConfirm = useCallback(() => {
        console.log('SENDING TO DHIS2 (coming soon)');
        exportToDHIS2(convertFormStateToDict(exportData));
    }, [exportData, exportToDHIS2]);

    const allowConfirm =
        Boolean(exportData.source_version_id.value) &&
        Boolean(exportData.source_status.value) &&
        exportData.fields_to_export.value.length > 0 &&
        Boolean(exportData.ref_version_id.value) &&
        Boolean(exportData.credentials.value);

    // Reset Treeview when changing ref datasource
    useEffect(() => {
        if (treeviewResetControl.current !== destinationDataVersionId) {
            treeviewResetControl.current = destinationDataVersionId;
        }
    }, [destinationDataVersionId]);

    return (
        <ConfirmCancelDialogComponent
            renderTrigger={renderTrigger}
            onConfirm={onXlsPreview}
            onClosed={reset}
            confirmMessage={MESSAGES.xlsPreview} // TODO change message
            cancelMessage={MESSAGES.cancel}
            maxWidth="md"
            allowConfirm={allowConfirm}
            titleMessage={{
                ...MESSAGES.exportDataSource,
                values: { dataSourceName },
            }}
            additionalButton
            additionalMessage={MESSAGES.export}
            onAdditionalButtonClick={onConfirm}
        >
            <Grid container spacing={2}>
                {/* Choose datasource */}
                <Grid container item spacing={2}>
                    {/* Data to export  */}
                    <Grid item xs={12}>
                        <Typography
                            className={classes.subTitle}
                            variant="subtitle1"
                        >
                            {formatMessage(MESSAGES.exportTitle)}
                        </Typography>
                    </Grid>
                    <Grid container item spacing={2}>
                        <Grid xs={6} item>
                            <InputComponent
                                type="select"
                                keyValue="source_version_id"
                                labelString={formatMessage(MESSAGES.version)}
                                value={exportData.source_version_id.value}
                                errors={exportData.source_version_id.errors}
                                onChange={setExportDataField}
                                options={dataSourceVersionsAsOptions(
                                    versions,
                                    defaultVersionId,
                                    formatMessage,
                                )}
                                required
                            />
                        </Grid>
                        <Grid xs={6} item>
                            <Box mt={1} mb={2}>
                                <OrgUnitTreeviewModal
                                    onConfirm={value => {
                                        setExportDataField(
                                            'source_org_unit_id',
                                            value?.id,
                                        );
                                    }}
                                    source={dataSourceId}
                                    titleMessage={formatMessage(
                                        MESSAGES.selectTopOrgUnit,
                                    )}
                                    required
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid xs={6} item>
                        <InputComponent
                            type="select"
                            keyValue="source_org_unit_types_ids"
                            labelString={formatMessage(MESSAGES.orgUnitTypes)}
                            value={exportData.source_org_unit_types_ids.value}
                            errors={exportData.source_org_unit_types_ids.errors} // TODO actually manage errors
                            onChange={(keyValue, newValue) => {
                                setExportDataField(
                                    keyValue,
                                    commaSeparatedIdsToArray(newValue),
                                );
                            }}
                            loading={areSourceVersionsLoading}
                            options={orgUnitTypes ?? []}
                            multi
                        />
                    </Grid>
                    <Grid xs={6} item>
                        <InputComponent
                            type="select"
                            labelString={formatMessage(MESSAGES.status)}
                            keyValue="source_status"
                            value={exportData.source_status.value}
                            errors={exportData.source_status.errors}
                            onChange={setExportDataField}
                            options={orgUnitStatusAsOptions(formatMessage)}
                            required
                        />
                    </Grid>
                    <Grid xs={12} item>
                        <InputComponent
                            type="select"
                            keyValue="fields_to_export"
                            labelString={formatMessage(MESSAGES.fieldsToExport)}
                            value={exportData.fields_to_export.value}
                            errors={exportData.fields_to_export.errors}
                            onChange={(keyValue, newValue) => {
                                setExportDataField(
                                    keyValue,
                                    commaSeparatedIdsToStringArray(newValue),
                                );
                            }}
                            options={fieldsToExport}
                            multi
                            required
                        />
                    </Grid>
                    <Grid xs={12} item>
                        <Divider />
                    </Grid>
                </Grid>
                {/* End data to export */}
                <Grid container item spacing={2}>
                    <Grid item xs={12}>
                        <Typography
                            className={classes.subTitle}
                            variant="subtitle1"
                        >
                            {formatMessage(MESSAGES.targetDataSource)}
                        </Typography>
                    </Grid>
                    <Grid xs={6} item>
                        <InputComponent
                            type="select"
                            keyValue="ref_version_id"
                            labelString={formatMessage(MESSAGES.datasourceRef)}
                            value={exportData.ref_version_id.value}
                            errors={exportData.ref_version_id.errors}
                            onChange={onTargetSourceVersionChange}
                            options={refDataSourceVersionsAsOptions({
                                formatMessage,
                                defaultVersionId,
                                versions: sourceVersions,
                            })}
                            loading={areOrgUnitTypesLoading}
                            required
                        />
                    </Grid>
                    <Grid xs={6} item>
                        <Box mt={1} mb={2}>
                            <OrgUnitTreeviewModal
                                onConfirm={value => {
                                    setExportDataField(
                                        'ref_top_org_unit_id',
                                        value?.id,
                                    );
                                }}
                                version={destinationDataVersionId}
                                titleMessage={formatMessage(
                                    MESSAGES.selectTopOrgUnit,
                                )}
                                resetTrigger={
                                    treeviewResetControl.current !==
                                    destinationDataVersionId
                                }
                                disabled={!destinationDataVersionId}
                                required={false}
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} item>
                        <InputComponent
                            type="select"
                            keyValue="credentials"
                            labelString={formatMessage(MESSAGES.credentials)}
                            value={exportData.credentials.value}
                            errors={exportData.credentials.errors}
                            loading={areCredentialsLoading}
                            onChange={setExportDataField}
                            options={credentialsAsOptions(credentials)}
                            required
                        />
                    </Grid>
                </Grid>
            </Grid>
        </ConfirmCancelDialogComponent>
    );
};