import React, { useState, useCallback } from 'react';
import { DynamicSelect } from './DynamicSelect';
import { MESSAGES } from './messages';
import { IasoTreeView } from './IasoTreeView';
import { adaptMap } from './utils';
import { FunctionComponent } from 'react';
import { string } from 'prop-types';

type Props = {
    labelField:string, //name
    nodeField:string, //id
    getChildrenData: (...args:any[])=>any,
    getRootData: (...args:any[])=>any,
    toggleOnLabelClick?: boolean,
    onSelect: (...args:any[])=>any,
    minResultCount: number,
    inputLabelObject: Record<string,unknown>,
    withSearchButton: boolean,
    request: (...args:any[])=>any,
    makeDropDownText: (...args:any[])=>any,
    toolTip: (...args:any[])=>any, // actually a component
    parseNodeIds: (...args:any[])=>any,
    onUpdate: (...args:any[])=>any,
    multiselect: boolean,
    preselected: string|string[]|null,
    preexpanded: Map<any,any>|null,
    // TODO type selectedData: orgUnit (full)
    selectedData: Record<string,unknown>|Record<string,unknown>[],
}


const TreeViewWithSearch:FunctionComponent<Props> = ({
    labelField, 
    nodeField,
    getChildrenData=()=>null,
    getRootData=()=>null,
    toggleOnLabelClick,
    onSelect=()=>null,
    minResultCount=50,
    inputLabelObject=MESSAGES.selectSingle,
    withSearchButton=false,
    request=()=>null,
    makeDropDownText,
    toolTip = ()=>null,
    parseNodeIds,
    onUpdate=()=>null,
    multiselect=false,
    preselected=null, // TODO rename
    preexpanded=null, // TODO rename
    selectedData=[],
}) => {
    console.log("selectedData", selectedData);
    
    const [data, setData] = useState<Record<string,unknown>[]>(
        Array.isArray(selectedData) ? selectedData : [selectedData],
    );
    const [selected, setSelected] = useState<string|string[]>(
        preselected || (multiselect ? [] : ''),
    );
    const [expanded, setExpanded] = useState(adaptMap(preexpanded) ?? []);
    const [ticked, setTicked] = useState<string|string[]>(preselected ?? []);
    const [parentsTicked, setParentsTicked] = useState<Map<string,Map<string,string>>>(
        preexpanded ?? new Map(),
    );
    const [scrollIntoView, setScrollIntoView] = useState<string|null>(
        !Array.isArray(preselected) ? preselected : null,
    );

    const onNodeSelect = useCallback(
        (selection:string|string[]):void => {
            setSelected(selection);
            if (multiselect) {
                // disabling when multiselect to avoid allowing user to confirm data while boxes are unticked
                onSelect(selection);
            }
        },
        [onSelect, multiselect],
    );

    // Tick and untick checkbox
    const onLabelClick = useCallback(
        (id:string, itemData:Record<string,unknown>) => {
            let newTicked :string[]=[];
            let updatedParents = new Map<any,any>() ;
            let updatedSelectedData:Record<string,unknown>[]=[];
            if (multiselect) {
                newTicked = ticked.includes(id)
                    ? (ticked as string[]).filter(tickedId => tickedId !== id)
                    : [...ticked, id];
                updatedParents = new Map(parentsTicked);
            } else {
                newTicked = [id];
            }
            setTicked(newTicked);
            if (parentsTicked.has(id)) {
                updatedParents.delete(id);
                updatedSelectedData = data.filter(d => d.id !== id);
            } else {
                // FIXME parseNodeIds and itemData are going to be tricky to type without tying the typing to OrgUnits
                // Generics needed here
                updatedParents.set(id, parseNodeIds(itemData));
                if (multiselect) {
                    updatedSelectedData = [...data, itemData];
                } else {
                    updatedSelectedData = [itemData];
                }
            }
            onUpdate(newTicked, updatedParents, updatedSelectedData);
            setParentsTicked(updatedParents);
            setData(updatedSelectedData);
        },
        [onUpdate, ticked, parentsTicked, multiselect, data],
    );

    const onSearchSelect = useCallback(
        // this is an org unit so you can access the parents here
        searchSelection => {
            console.log("searchSelection", searchSelection);
            // TODO add parseNodeIds return type
            const ancestors = parseNodeIds(searchSelection);
            console.log("ancestors", ancestors);
            const idsToExpand = Array.from(ancestors.keys()).map(id =>
                id.toString(),
            );
            const currentId = idsToExpand[idsToExpand.length - 1];
            // Not expanding the last selected item as it messes with the scrollIntoView
            idsToExpand.pop();

            if (multiselect) {
                setExpanded([...expanded, ...idsToExpand]);
                const newSelected = [...selected, currentId];
                onNodeSelect(newSelected);
            } else {
                setExpanded(idsToExpand);
                const newParentsTicked = new Map();
                newParentsTicked.set(currentId, ancestors);
                onNodeSelect(currentId);
                setData([searchSelection]);
                // We don't call it in multiselect because it will only be called on label click
                // We use it here to auto select the search item selected
                onUpdate(currentId, newParentsTicked, [searchSelection]);
            }
            setScrollIntoView(currentId);
        },
        [parseNodeIds, onNodeSelect, selected, onUpdate],
    );

    return (
        <>
            <DynamicSelect
                onSelect={onSearchSelect}
                minResultCount={minResultCount}
                inputLabelObject={inputLabelObject}
                withSearchButton={withSearchButton}
                request={request}
                makeDropDownText={makeDropDownText}
                toolTip={toolTip}
            />
            <IasoTreeView
                labelField={labelField}
                nodeField={nodeField}
                getChildrenData={getChildrenData}
                getRootData={getRootData}
                toggleOnLabelClick={toggleOnLabelClick}
                selected={selected}
                onSelect={onNodeSelect}
                expanded={expanded}
                onToggle={setExpanded}
                onLabelClick={onLabelClick}
                multiselect={multiselect}
                ticked={ticked}
                parentsTicked={adaptMap(parentsTicked)}
                scrollIntoView={scrollIntoView}
            />
        </>
    );
};

export { TreeViewWithSearch };
