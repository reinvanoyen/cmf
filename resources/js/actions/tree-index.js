import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import api from "../api/api";
import str from "../util/str";
import i18n from "../util/i18n";
import Tree from "../core/ui/tree";
import path from "../state/path";

function TreeIndex(props) {

    const [state, setState] = useState({
        isLoading: true,
        rows: []
    });

    const location = useSelector(state => state.location);

    useEffect(() => {
        load(location.current.params);
    }, [location.current.params]);

    useEffect(() => {
        if (location.refresh) {
            load(location.current.params);
        }
    }, [location.refresh]);

    const load = async (params = {}) => {

        // Execute the get request
        const response = await api.execute.get(props.path, props.id,'load', params);

        setState({
            ...state,
            isLoading: false,
            rows: response.data.data
        });
    }

    const handleParentChange = async (id, parentId, children = []) => {
        await api.execute.get(props.path, props.id,'updateParent', {id, parentId, children});
    };

    const handleOrderChange = async (children = []) => {
        await api.execute.get(props.path, props.id,'updateOrder', {children});
    };

    const handleRowClick = (row) => {
        path.goTo(props.path.module, props.action, {
            id: row.id
        });
    }

    const renderHeader = () => {
        return (
            <div className="index__header">
                <div className="index__header-title">
                    {str.toUpperCaseFirst(props.plural)}
                </div>
            </div>
        );
    }

    const renderPlaceholder = () => {
        return (
            <div className="index__placeholder">
                {i18n.get('snippets.no_plural_found', {plural: props.plural})}
            </div>
        );
    }

    const renderRows = () => {

        if (state.rows.length) {
            return <Tree
                data={state.rows}
                onParentChange={handleParentChange}
                onOrderChange={handleOrderChange}
                onClick={handleRowClick}
            />;
        }

        return renderPlaceholder();
    }

    const render = () => {
        return (
            <div className={'index index--'+props.style+(state.isLoading ? ' index--loading' : '')}>
                {renderHeader()}
                {renderRows()}
            </div>
        );
    }

    return render();
}

TreeIndex.defaultProps = {
    type: '',
    components: [],
    path: {},
    id: 0,
    data: {},
    params: {},
    action: '',
    plural: '',
    singular: ''
};

export default TreeIndex;
