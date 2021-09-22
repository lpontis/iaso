import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import PropTypes from 'prop-types';
import { createUrl } from 'bluesquare-components';

import InputComponent from '../forms/InputComponent';

class FiltersComponent extends React.Component {
    onChange(urlKey, value, callback) {
        if (callback) {
            callback(value, urlKey);
        } else {
            const { params, redirectTo, baseUrl } = this.props;
            const newParams = {
                ...params,
            };
            newParams[urlKey] = value;
            this.props.onFilterChanged(value);
            redirectTo(baseUrl, newParams);
        }
    }

    onSearchChange(urlKey, value, launchSearch = false, callback) {
        if (callback) {
            callback(value, urlKey);
        } else {
            const newState = { ...this.state, [urlKey]: value };
            this.setState(newState);
            if (launchSearch) {
                this.onSearch(newState);
            }
        }
    }

    onNumberConfirm(urlKey, value, callback) {
        if (this.props.changeOnEnterOnly && value) {
            this.onChange(urlKey, value, callback);
        }
        this.props.onEnterPressed();
    }

    onSearch(state = this.state) {
        const { params, redirectTo, baseUrl } = this.props;
        const newParams = {
            ...params,
        };
        Object.keys(state).map(objectKey => {
            const value = state[objectKey];
            newParams[objectKey] = value;
            return null;
        });

        this.props.onFilterChanged();
        redirectTo(baseUrl, newParams);
    }

    toggleCheckbox(checked, urlKey, filter) {
        const { params, redirectTo, baseUrl } = this.props;
        const newParams = {
            ...params,
        };
        if (checked) {
            newParams[urlKey] = 'true';
        } else if (filter.checkedIfNull) {
            newParams[urlKey] = 'false';
        } else if (newParams[urlKey]) {
            delete newParams[urlKey];
        }
        this.props.onFilterChanged();
        redirectTo(baseUrl, newParams);
    }

    render() {
        const { filters, params, onEnterPressed } = this.props;
        if (!filters) {
            return null;
        }
        return (
            <section>
                {filters.map(filter => {
                    let filterValue = filter.value || params[filter.urlKey];
                    if (filter.useKeyParam === false) {
                        filterValue = filter.value;
                    }
                    if (!filterValue && filter.defaultValue) {
                        filterValue = filter.defaultValue;
                    }
                    if (
                        !filter.hideEmpty ||
                        (filter.hideEmpty && filter.options.length !== 0)
                    ) {
                        return (
                            <Fragment
                                key={filter.uid ? filter.uid : filter.urlKey}
                            >
                                {filter.type === 'number' && (
                                    <InputComponent
                                        keyValue={filter.urlKey}
                                        onChange={(key, value) => {
                                            if (!this.props.changeOnEnterOnly)
                                                this.onChange(
                                                    filter.urlKey,
                                                    value,
                                                    filter.callback,
                                                );
                                            this.setState({
                                                [filter.urlKey]: value,
                                            });
                                        }}
                                        value={filterValue}
                                        type="number"
                                        label={filter.label}
                                        onEnterPressed={() =>
                                            this.onNumberConfirm(
                                                filter.urlKey,
                                                this.state[filter.urlKey],
                                                filter.callback,
                                            )
                                        }
                                    />
                                )}
                                {filter.type === 'select' && (
                                    <InputComponent
                                        loading={filter.loading}
                                        multi={filter.isMultiSelect}
                                        clearable={filter.isClearable}
                                        disabled={filter.isDisabled || false}
                                        keyValue={filter.urlKey}
                                        onChange={(key, value) => {
                                            this.onChange(
                                                filter.urlKey,
                                                value,
                                                filter.callback,
                                            );
                                        }}
                                        value={filterValue}
                                        type="select"
                                        options={filter.options}
                                        label={filter.label}
                                        labelString={filter.labelString}
                                        getOptionSelected={
                                            filter.getOptionSelected
                                        }
                                        getOptionLabel={filter.getOptionLabel}
                                        renderOption={filter.renderOption}
                                    />
                                )}

                                {filter.type === 'search' && (
                                    <InputComponent
                                        disabled={filter.isDisabled || false}
                                        keyValue={filter.urlKey}
                                        uid={filter.uid}
                                        onChange={(key, value) =>
                                            this.onSearchChange(
                                                key,
                                                value,
                                                true,
                                                filter.callback,
                                            )
                                        }
                                        value={filterValue}
                                        type="search"
                                        label={filter.label}
                                        onEnterPressed={onEnterPressed}
                                    />
                                )}

                                {filter.type === 'checkbox' && ( // TODO: check with team
                                    <InputComponent
                                        disabled={filter.isDisabled || false}
                                        keyValue={filter.urlKey}
                                        onChange={(key, checked) =>
                                            this.toggleCheckbox(
                                                checked,
                                                filter.urlKey,
                                                filter,
                                            )
                                        }
                                        value={
                                            this.props.params[filter.urlKey] ===
                                                'true' ||
                                            (this.props.params[
                                                filter.urlKey
                                            ] === undefined &&
                                                filter.checkedIfNull)
                                        }
                                        type="checkbox"
                                        label={filter.label}
                                    />
                                )}
                            </Fragment>
                        );
                    }
                    return null;
                })}
            </section>
        );
    }
}
FiltersComponent.defaultProps = {
    baseUrl: '',
    onEnterPressed: () => null,
    onFilterChanged: () => null,
    changeOnEnterOnly: false,
};

FiltersComponent.propTypes = {
    filters: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    redirectTo: PropTypes.func.isRequired,
    baseUrl: PropTypes.string,
    onEnterPressed: PropTypes.func,
    onFilterChanged: PropTypes.func,
    changeOnEnterOnly: PropTypes.bool, // Introduced to fix IA-784. A better solution should be foun when addressing IA-735 and other related bugs
};

const MapStateToProps = () => ({});

const MapDispatchToProps = dispatch => ({
    redirectTo: (key, params) =>
        dispatch(replace(`${key}${createUrl(params, '')}`)),
});

export default connect(MapStateToProps, MapDispatchToProps)(FiltersComponent);
