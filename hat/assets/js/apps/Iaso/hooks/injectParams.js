import React from 'react';
import PropTypes from 'prop-types';
import { useSafeParams } from './useSafeParams';

const FakeComponent = props => {
    const propsCopy = { ...props };
    const Component = props.component;
    const params = useSafeParams(props.pathParams, props.baseUrl);
    delete propsCopy.pathParams;
    delete propsCopy.baseUrl;
    delete propsCopy.component;
    delete propsCopy.ref;
    return (
        <Component {...propsCopy} params={params} forwardedRef={props.ref} />
    );
};

FakeComponent.defaultProps = {
    ref: undefined,
    pathParams: [],
    baseUrl: '',
};

FakeComponent.propTypes = {
    component: PropTypes.any.isRequired,
    ref: PropTypes.object,
    pathParams: PropTypes.array,
    baseUrl: PropTypes.string,
};

/**
 * same as newIjectIntl in iaso-root codebase
 * used to inject a patched version of react-intl
 *
 */
const injectParams = (Component, pathParams, baseUrl) =>
    React.forwardRef((props, ref) => {
        const propsCopy = {
            ...props,
            component: Component,
            pathParams,
            baseUrl,
            ref,
        };
        console.log('pathParams', pathParams);
        return <FakeComponent {...propsCopy} />;
    });
export { injectParams };
