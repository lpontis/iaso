import { useLocation } from 'react-router-dom';

const useSafeParams = (pathParams, baseUrl) => {
    const location = useLocation();
    const params = {};
    const paramsArray = location.pathname
        .replace(`/${baseUrl}/`, '')
        .split('/');
    pathParams.forEach(param => {
        const paramIndex = paramsArray.findIndex(p => p === param.key);
        if (paramIndex !== -1) {
            params[param.key] = paramsArray[paramIndex + 1];
        }
    });
    return params;
};

export { useSafeParams };
