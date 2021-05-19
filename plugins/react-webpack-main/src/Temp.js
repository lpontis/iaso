import React from 'react';
const TestComponent = React.lazy(() => import('iaso_root/TestComponent'));

const Temp = () => {
    return <div>
        <h1>TEST APP</h1>
        <React.Suspense fallback="Loading TestComponent">
            <TestComponent />
        </React.Suspense>
    </div>;
};

export default Temp;
