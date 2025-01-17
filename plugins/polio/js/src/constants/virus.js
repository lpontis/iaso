import deepPurple from '@material-ui/core/colors/deepPurple';
import orange from '@material-ui/core/colors/orange';
import green from '@material-ui/core/colors/green';

const polioViruses = [
    {
        value: 'PV1',
        label: 'PV1',
    },
    {
        value: 'PV2',
        label: 'PV2',
    },
    {
        value: 'PV3',
        label: 'PV3',
    },
    {
        value: 'cVDPV2',
        label: 'cVDPV2',
    },
];

const polioVacines = [
    {
        value: 'mOPV2',
        label: 'mOPV2',
        color: deepPurple['400'],
    },
    {
        value: 'nOPV2',
        label: 'nOPV2',
        color: orange['400'],
    },
    {
        value: 'bOPV',
        label: 'bOPV',
        color: green['400'],
    },
];

export { polioViruses, polioVacines };
