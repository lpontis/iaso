import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Typography, Box } from '@material-ui/core';

import { LoadingSpinner, useSafeIntl } from 'bluesquare-components';
import ConfirmCancelDialogComponent from '../../../components/dialogs/ConfirmCancelDialogComponent';
import FileInputComponent from '../../../components/forms/FileInputComponent';
import PeriodPicker from '../../periods/components/PeriodPickerComponent';

import MESSAGES from '../messages';
import { useFormState } from '../../../hooks/form';
import { errorTypes, getPeriodsErrors } from '../../periods/utils';

import { enqueueSnackbar } from '../../../redux/snackBarsReducer';
import { succesfullSnackBar } from '../../../constants/snackBars';
import { FormVersionPutData, useCreateFormVersion,useUpdateFormVersion } from '../requests';

const emptyVersion = (id = null) => ({
    id,
    start_period: null,
    end_period: null,
    xls_file: null,
});

const FormVersionsDialogComponent = ({
    formVersion,
    titleMessage,
    onConfirmed,
    formId,
    periodType,
    ...dialogProps
}) => {
    const dispatch = useDispatch();
    const intl = useSafeIntl();
    const [isLoading, setIsLoading] = useState(false);
    const [formState, setFieldValue, setFieldErrors, setFormState] =
        useFormState({
            id: formVersion.id,
            start_period: formVersion.start_period,
            end_period: formVersion.end_period,
            xls_file: formVersion.xls_file,
        });

    const [periodsErrors, setPeriodsErrors] = useState<any>(
        getPeriodsErrors(
            formState.start_period.value,
            formState.end_period.value,
            periodType,
        ),
    );

    const {mutate:createFormVersion}=useCreateFormVersion();
    const {mutate:updateFormVersion}=useUpdateFormVersion(formId);

    useEffect(() => {
        setPeriodsErrors(
            getPeriodsErrors(
                formState.start_period.value,
                formState.end_period.value,
                periodType,
            ),
        );
    }, [formState.start_period.value, formState.end_period.value, periodType]);

    const onConfirm = useCallback(
        async closeDialog => {
            setIsLoading(true);

            const onSuccess = ()=>{
                closeDialog();
                setFormState(emptyVersion(formVersion.id));
                onConfirmed();
                dispatch(enqueueSnackbar(succesfullSnackBar()));
            }
            const onError=error=>{
                if (error.status === 400) {
                    Object.entries(error.details).forEach(entry =>
                    setFieldErrors(entry[0], entry[1]),)
                }
            }
            const data :any = {
                form_id: formId,
            };
            if (formState.start_period.value) {
                data.start_period = formState.start_period.value;
            }
            if (formState.end_period.value) {
                data.end_period = formState.end_period.value;
            }
            if (formVersion.id) {
                data.id = formVersion.id;
                updateFormVersion(data,{
                    onSuccess,
                    onError,
                })
            } else {
                createFormVersion({xls_file: formState.xls_file.value,data,}, {onSuccess,onError})
            }
            setIsLoading(false);
        },
        [
            dispatch,
            setFieldErrors,
            formState,
            formId,
            formVersion.id,
            onConfirmed,
            setFormState,
            createFormVersion,
            updateFormVersion
        ],
    );

    const handleCancel = closeDialog => {
        setFormState({
            id: formVersion.id,
            start_period: formVersion.start_period,
            end_period: formVersion.end_period,
            xls_file: formVersion.xls_file,
        });
        closeDialog();
    };
    const allowConfirm = () => {
        return Boolean(
            !periodsErrors.start &&
                !periodsErrors.end &&
                ((!formState.id.value && formState.xls_file.value) ||
                    formState.id.value),
        );
    };
    const startPeriodInvalid = periodsErrors?.start?.invalid;
    const endPeriodInvalid = periodsErrors?.end?.invalid;
    const chronologicalError =
        (periodsErrors?.start?.chronological) ||
        (periodsErrors?.end?.chronological);
    return (
        <>
            {isLoading && <LoadingSpinner />}
            <ConfirmCancelDialogComponent
                allowConfirm={allowConfirm()}
                onCancel={handleCancel}
                maxWidth="xs"
                titleMessage={titleMessage}
                onConfirm={onConfirm}
                cancelMessage={MESSAGES.cancel}
                confirmMessage={MESSAGES.save}
                // somehow TS forced to add these props. Related to bad intercation withPropTypes I guess
                additionalButton= {false}
                additionalMessage= {null}
                onAdditionalButtonClick= {null}
                {...dialogProps}
            >
                <Grid container spacing={4} justifyContent="flex-start">
                    <Grid xs={12} item>
                        {!formState.id.value && (
                            <FileInputComponent
                                keyValue="xls_file"
                                onChange={setFieldValue}
                                value={formState.xls_file.value}
                                label={MESSAGES.xls_form_file}
                                errors={formState.xls_file.errors}
                                required
                            />
                        )}
                        <PeriodPicker
                            hasError={Boolean(periodsErrors.start)}
                            periodType={periodType}
                            title={intl.formatMessage(MESSAGES.startPeriod)}
                            activePeriodString={
                                !startPeriodInvalid
                                    ? formState.start_period.value
                                    : null
                            }
                            onChange={startPeriod =>
                                setFieldValue('start_period', startPeriod)
                            }
                        />
                        {startPeriodInvalid && (
                            <Box mb={2} mt={-3}>
                                <Typography
                                    id="start-invalid"
                                    variant="body1"
                                    color="error"
                                    // TS Errors on this prop
                                    // fontSize="small"
                                >
                                    {intl.formatMessage(
                                        errorTypes.invalid.message,
                                    )}
                                </Typography>
                            </Box>
                        )}
                        <PeriodPicker
                            hasError={Boolean(periodsErrors.end)}
                            periodType={periodType}
                            title={intl.formatMessage(MESSAGES.endPeriod)}
                            activePeriodString={
                                !endPeriodInvalid
                                    ? formState.end_period.value
                                    : null
                            }
                            onChange={endPeriod =>
                                setFieldValue('end_period', endPeriod)
                            }
                        />
                        {endPeriodInvalid && (
                            <Box mb={2} mt={-3}>
                                <Typography
                                    id="end-invalid"
                                    variant="body1"
                                    color="error"
                                    // fontSize="small"

                                >
                                    {intl.formatMessage(
                                        errorTypes.invalid.message,
                                    )}
                                </Typography>
                            </Box>
                        )}
                        {chronologicalError && (
                            <Box mb={2} mt={-1}>
                                <Typography
                                    id="chronological-error"
                                    variant="body1"
                                    color="error"
                                    // fontSize="small"

                                >
                                    {intl.formatMessage(
                                        errorTypes.chronological.message,
                                    )}
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </ConfirmCancelDialogComponent>
        </>
    );
};

FormVersionsDialogComponent.defaultProps = {
    formVersion: emptyVersion(),
    periodType: '',
    formId: 0,
};

FormVersionsDialogComponent.propTypes = {
    periodType: PropTypes.string,
    formVersion: PropTypes.object,
    formId: PropTypes.number,
    titleMessage: PropTypes.object.isRequired,
    renderTrigger: PropTypes.func.isRequired,
    onConfirmed: PropTypes.func.isRequired,
};
export default FormVersionsDialogComponent;
