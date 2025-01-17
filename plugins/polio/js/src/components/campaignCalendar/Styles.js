import { makeStyles } from '@material-ui/core';
import red from '@material-ui/core/colors/red';

const cellHeight = 50;
const smallCellHeight = 20;
export const useStyles = makeStyles(theme => ({
    tableContainer: {
        overflow: 'auto',
        width: '100%',
    },
    tableRow: {
        height: cellHeight,
        '& th:last-child, & td:last-child': {
            borderRight: `1px solid ${theme.palette.ligthGray.border}`,
        },
    },
    tableRowSmall: {
        height: smallCellHeight,
    },
    tableCell: {
        height: cellHeight,
        padding: 0,
        margin: 0,
        position: 'relative',
        borderLeft: `1px solid ${theme.palette.ligthGray.border}`,
    },
    tableCellHead: {
        height: cellHeight,
        padding: 0,
        margin: 0,
        position: 'sticky',
        borderLeft: `1px solid ${theme.palette.ligthGray.border}`,
    },
    tableCellTopBordered: {
        height: cellHeight,
        padding: 0,
        margin: 0,
        position: 'sticky',
        borderTop: `1px solid ${theme.palette.ligthGray.border}`,
    },
    tableCellTitle: {
        width: '35px',
        padding: 0,
        margin: 0,
        position: 'sticky',
        height: cellHeight,
        borderLeft: `1px solid ${theme.palette.ligthGray.border}`,
        borderTop: `1px solid ${theme.palette.ligthGray.border}`,
    },
    tableCellTitleLarge: {
        width: '45px',
    },
    tableCellTitleSmall: {
        width: '30px',
    },
    tableCellTitleEmpty: {
        border: 'none',
        backgroundColor: theme.palette.common.white,
    },
    tableCellBordered: {
        borderLeft: `1px solid ${theme.palette.ligthGray.border}`,
    },
    tableCellDashed: {
        border: `1px dashed ${theme.palette.secondary.main} !important`,
    },
    tableCellSmall: {
        height: smallCellHeight,
    },
    tableRowHidden: {
        visibility: 'collapse',
    },
    tableCellHidden: {
        border: `1px solid white`,
        borderBottom: `1px solid ${theme.palette.ligthGray.border}`,
    },
    round: {
        color: theme.palette.common.white,
        fontSize: 12,
    },
    campaign: {
        backgroundColor: theme.palette.grey[200],
        border: 'none',
        fontSize: 12,
    },
    currentWeek: {
        backgroundColor: red['100'],
    },
    nav: {
        left: theme.spacing(2),
        top: 0,
        zIndex: 3,
        position: 'absolute',
        width: '31vw',
        display: 'flex',
        justifyContent: 'center',
    },
    navButton: {
        margin: theme.spacing(1.5),
        borderRadius: 100,
        padding: theme.spacing(1),
        minWidth: 0,
    },
    tableCellSpan: {
        position: 'absolute',
        display: 'flex',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        textTransform: 'uppercase',
    },
    tableCellSpanTitle: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        fontWeight: 'bold',
    },
    tableCellSpanWithPopOver: {
        cursor: 'pointer',
    },
    tableCellSpanRow: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        fontSize: 13,
    },
    popper: {
        zIndex: 500,
        width: 250,
    },
    popperClose: {
        position: 'relative',
        marginLeft: '85%',
        marginTop: theme.spacing(-1),
        marginBottom: theme.spacing(1),
    },
    helpIcon: {
        position: 'absolute',
        top: 4,
        right: 4,
        fontSize: 12,
    },
    mapLegend: {
        position: 'absolute',
        zIndex: 499,
        fontSize: 10,
        top: theme.spacing(2),
        right: theme.spacing(2),
    },
    mapLegendVaccine: {
        width: 100,
        marginTop: theme.spacing(2),
    },
    mapLegendCampaigns: {
        width: 165,
    },
    mapLegendTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: theme.spacing(1),
    },
    roundColor: {
        borderRadius: theme.spacing(3),
        height: theme.spacing(3),
        width: theme.spacing(3),
        border: `2px solid ${theme.palette.ligthGray.border}`,
    },
    mapLegendLabel: {
        textAlign: 'right',
    },
    noCampaign: {
        textAlign: 'center',
    },
}));
