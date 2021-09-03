import { push, replace } from 'connected-react-router';
// import { createUrl } from 'bluesquare-components';
const createUrl = (params, url = '/') => {
    // Create a url from an params object
    // e.g.: `{foo: 11, bar: 22} => '/foo/11/bar/22'`
    Object.keys(params).forEach(key => {
        const value = params[key];
        console.log(key, value);
        if (value) {
            url += `/${key}/${value}`; // eslint-disable-line
        }
    });
    return url;
};

export function redirectTo(key, params) {
    return dispatch => dispatch(push(`/${key}${createUrl(params, '')}`));
}
export function redirectToReplace(key, params) {
    return dispatch => dispatch(replace(`/${key}${createUrl(params, '')}`));
}
