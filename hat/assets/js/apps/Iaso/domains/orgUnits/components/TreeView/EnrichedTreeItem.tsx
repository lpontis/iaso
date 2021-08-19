import React, {
    useCallback,
    useRef,
    useEffect,
    FunctionComponent,
    ReactChild,
} from 'react';
import { TreeItem } from '@material-ui/lab';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import { makeStyles } from '@material-ui/core/styles';
import { useAPI } from '../../../../utils/requests';

const styles = theme => ({
    treeItem: {
        '&.MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label':
            {
                backgroundColor: theme.palette.primary.background,
                alignItems: 'center',
            },
    },
    checkbox: {
        color: theme.palette.mediumGray.main,
        fontSize: '16px',
        marginRight: '5px',
    },
});

const useStyles = makeStyles(styles);

type Props = {
    label: string;
    id: string;
    hasChildren?: boolean;
    fetchChildrenData?: // eslint-disable-next-line no-unused-vars
    ((id: string) => SubTree) | (() => null); // fetchChildrenData(id)
    expanded?: string[];
    toggleOnLabelClick?: boolean;
    // eslint-disable-next-line no-unused-vars
    onLabelClick?: ((id: string, data: any) => void) | (() => null);
    data?: any; // additional data that can be passed up to the parent (eg org unit details)
    withCheckbox?: boolean;
    ticked?: string | string[];
    parentsTicked?: string[];
    scrollIntoView: string | null;
};

type SubTree = {
    id: number;
    name: string;
    hasChildren: boolean;
    data: any;
};

const EnrichedTreeItem: FunctionComponent<Props> = ({
    label,
    id,
    hasChildren = false,
    fetchChildrenData = () => null,
    expanded = [],
    toggleOnLabelClick = true,
    onLabelClick = () => null,
    data = null, // additional data that can be passed up to the parent (eg org unit details)
    withCheckbox = false,
    ticked = [],
    parentsTicked = [],
    scrollIntoView = null,
}) => {
    const classes = useStyles();
    const isExpanded: boolean = expanded.includes(id);
    const isTicked: boolean = ticked.includes(id);
    const isTickedParent: boolean = parentsTicked.includes(id);
    const { data: childrenData, isLoading } = useAPI<SubTree[]>(
        fetchChildrenData,
        id,
        {
            preventTrigger: !isExpanded,
            additionalDependencies: [],
        },
    );
    const ref = useRef<any>();

    const makeIcon = (
        hasCheckbox: boolean,
        hasBeenTicked: boolean,
        tickedParent: boolean,
    ) => {
        if (!hasCheckbox) return null;
        if (hasBeenTicked) return <CheckBoxIcon className={classes.checkbox} />;
        if (tickedParent)
            return <IndeterminateCheckBoxIcon className={classes.checkbox} />;
        return (
            <CheckBoxOutlineBlankOutlinedIcon className={classes.checkbox} />
        );
    };

    const makeLabel = (
        child: ReactChild,
        hasCheckbox: boolean,
        hasBeenTicked: boolean,
        tickedParent = false,
    ) => (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                verticalAlign: 'middle',
            }}
        >
            {makeIcon(hasCheckbox, hasBeenTicked, tickedParent)}
            {child}
        </div>
    );

    const handleLabelClick = useCallback(
        e => {
            if (!toggleOnLabelClick) {
                e.preventDefault();
            }
            onLabelClick(id, data);
        },
        [onLabelClick, id, data, toggleOnLabelClick],
    );

    useEffect(() => {
        if (scrollIntoView === id) {
            ref.current?.scrollIntoView();
        }
    }, [scrollIntoView, id]);

    const makeSubTree = (subTreeData: SubTree[] | null) => {
        if (!subTreeData) return null;
        return subTreeData.map((unit: SubTree) => (
            <EnrichedTreeItem
                key={`TreeItem ${unit.id}`}
                label={unit.name || `id: ${unit.id.toString()}`}
                id={unit.id.toString()}
                fetchChildrenData={fetchChildrenData}
                expanded={expanded}
                hasChildren={unit.hasChildren}
                toggleOnLabelClick={toggleOnLabelClick}
                onLabelClick={onLabelClick}
                data={unit.data ?? null}
                withCheckbox={withCheckbox}
                ticked={ticked}
                parentsTicked={parentsTicked}
                scrollIntoView={scrollIntoView}
            />
        ));
    };
    if (isExpanded && isLoading) {
        return (
            <TreeItem
                classes={{ root: classes.treeItem }}
                ref={ref}
                label={makeLabel(
                    label || `id: ${id.toString()}`,
                    withCheckbox,
                    isTicked,
                    isTickedParent,
                )}
                nodeId={id}
                icon={<ArrowDropDownIcon style={{ fontSize: 'large' }} />}
            />
        );
    }
    if (hasChildren) {
        return (
            <div style={{ display: 'flex' }}>
                <TreeItem
                    classes={{ root: classes.treeItem }}
                    ref={ref}
                    label={makeLabel(
                        label || `id: ${id.toString()}`,
                        withCheckbox,
                        isTicked,
                        isTickedParent,
                    )}
                    nodeId={id}
                    collapseIcon={
                        <ArrowDropDownIcon style={{ fontSize: '24px' }} />
                    }
                    expandIcon={<ArrowRightIcon style={{ fontSize: '24px' }} />}
                    onLabelClick={handleLabelClick}
                >
                    {childrenData && isExpanded && makeSubTree(childrenData)}
                    {!isExpanded && <div />}
                </TreeItem>
            </div>
        );
    }
    return (
        <div style={{ display: 'flex' }}>
            <TreeItem
                classes={{ root: classes.treeItem }}
                ref={ref}
                label={makeLabel(
                    label || `id: ${id.toString()}`,
                    withCheckbox,
                    isTicked,
                )}
                nodeId={id}
                collapseIcon={
                    <ArrowDropDownIcon style={{ fontSize: '24px' }} />
                }
                expandIcon={<ArrowRightIcon style={{ fontSize: '24px' }} />}
                onLabelClick={handleLabelClick}
            />
        </div>
    );
};

// EnrichedTreeItem.propTypes = {
//     label: string.isRequired,
//     id: string.isRequired,
//     // should be wrapped in useCallback by parent
//     fetchChildrenData: func,
//     expanded: arrayOf(string),
//     hasChildren: bool,
//     toggleOnLabelClick: bool,
//     data: any,
//     onLabelClick: func,
//     withCheckbox: bool,
//     ticked: oneOfType([string, array]),
//     parentsTicked: array,
//     scrollIntoView: string,
// };

// EnrichedTreeItem.defaultProps = {
//     fetchChildrenData: () => {},
//     expanded: [],
//     hasChildren: false,
//     toggleOnLabelClick: true,
//     onLabelClick: () => {},
//     data: null,
//     withCheckbox: false,
//     ticked: [],
//     parentsTicked: [],
//     scrollIntoView: null,
// };

export { EnrichedTreeItem };
