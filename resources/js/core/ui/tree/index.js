import './index.scss';

import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import {Tree as TreeView, MultiBackend, getBackendOptions} from "@minoru/react-dnd-treeview";
import Icon from "../icon";
import DragInsertPlaceholder from "../drag-insert-placeholder";
import clsx from "clsx";
import DragPlaceholder from "../drag-placeholder";
import components from "../../../rendering/components";

function TreeRow({onClick, isDroppable, isDropTarget, isOpen, onToggle, text, depth, actions = [], hasChildren}) {
    return (
        <div onClick={onClick} className={clsx('tree__item tree-row', {
            'tree-row--drop-target': isDropTarget
        })}>
            <div className="tree-row__body" style={{ paddingInlineStart: depth * 25 }}>
                {isDroppable && (
                    <div className="tree-row__toggle">
                        {hasChildren && (
                            <Icon name={(isOpen ? 'expand_more' : 'chevron_right')} onClick={onToggle} />
                        )}
                        {! hasChildren && <Icon name={'chevron_right'} style={['disabled', 'small']} />}
                    </div>
                )}
                <div className="tree-row__content">
                    {text}
                </div>
                {actions.length && (
                    <div className="tree-row__actions">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}

function Tree({data, path, onParentChange = null, onOrderChange = null, onClick = null, actions = []}) {

    const [treeData, setTreeData] = useState(data);

    const handleDrop = (newTree, { dragSourceId, dropTargetId, dragSource, dropTarget }) => {
        const children = newTree.filter((item) => item.parent === dropTargetId).map(child => child.id);

        if (dragSource.parent !== dropTargetId) {
            if (onParentChange) {
                onParentChange(dragSourceId, dropTargetId, children);
            }
        } else {
            if (onOrderChange) {
                onOrderChange(children);
            }
        }
        setTreeData(newTree);
    };

    const handleClick = (item) => {
        if (onClick) {
            onClick(item);
        }
    };

    const renderActions = (rowData) => {
        return actions.map((component, i) => {
            return (
                <div className="tree-row__action" key={i}>
                    {components.renderComponent(component, rowData, path)}
                </div>
            );
        });
    }

    return (
        <div className="tree">
            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <TreeView
                    tree={treeData}
                    rootId={null}
                    sort={false}
                    listComponent={'div'}
                    listItemComponent={'div'}
                    dropTargetOffset={5}
                    insertDroppableFirst={false}
                    render={(node, { isDropTarget, depth, isOpen, onToggle, hasChild }) => {
                        return (
                            <TreeRow
                                onClick={() => handleClick(node)}
                                hasChildren={hasChild}
                                isDropTarget={isDropTarget}
                                isDroppable={node.droppable}
                                onToggle={onToggle}
                                depth={depth}
                                isOpen={isOpen}
                                text={node.text}
                                actions={renderActions(node)}
                            />
                        );
                    }}
                    dragPreviewRender={(monitorProps) => (
                        <DragPlaceholder text={monitorProps.item.text} />
                    )}
                    canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
                        if (dragSource?.parent === dropTargetId) {
                            return true;
                        }
                    }}
                    placeholderRender={() => (
                        <DragInsertPlaceholder />
                    )}
                    onDrop={handleDrop}
                />
            </DndProvider>
        </div>
    );
}

export default Tree;
