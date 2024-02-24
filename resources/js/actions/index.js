import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import components from "../rendering/components";
import api from "../api/api";
import path from "../state/path";
import Pagination from "../core/ui/pagination";
import Search from "../core/ui/search";
import str from "../util/str";
import i18n from "../util/i18n";
import ContextMenu from "../core/ui/context-menu";
import usePrevious from "../hooks/use-previous";
import FiltersTool from "../core/ui/filters-tool";
import Checkbox from "../core/ui/checkbox";
import clsx from "clsx";

function Index(props) {

    const [state, setState] = useState({
        isLoading: true,
        rows: [],
        selectedRowIds: [],
        meta: null,
        hasActiveFilters: false
    });

    const prevDataId = usePrevious(props.data.id);
    const location = useSelector(state => state.location);

    useEffect(() => {
        if (props.restrictByFk || props.relationship) {
            if (props.data.id !== prevDataId) {
                load();
            }
        }
    });

    useEffect(() => {
        load(location.current.params);
    }, [location.current.params]);

    useEffect(() => {
        if (location.refresh) {
            load(location.current.params);
        }
    }, [location.refresh]);

    const load = async (params = {}) => {

        let hasActiveFilters = false;
        // If filter params are set, add them to the http params
        for (let i = 0; i < props.filters.length; i++) {
            let filter = props.filters[i];
            let filterId = filter.id;
            if (location.current.params['filter_'+filterId]) {
                params['filter_'+filterId] = location.current.params['filter_'+filterId];
                hasActiveFilters = true;
            }
        }

        // Add FK to the params
        if (props.restrictByFk) {
            params.foreign = props.data.id;
        }

        // Add the current data id to the params because we need it to fetch the relationship
        if (props.relationship) {
            params.relation = props.data.id;
        }

        // Execute the get request
        const response = await api.execute.get(props.path, props.id,'load', params);

        setState({
            ...state,
            isLoading: false,
            hasActiveFilters,
            rows: response.data.data,
            meta: response.data.meta || null
        });
    }

    const onRowClick = (row) => {
        path.goTo(props.path.module, props.action, {
            id: row.id
        });
    }

    const getRowStyle = () => {
        return {
            gridTemplateColumns: (props.grid.length ? props.grid.join('fr ')+'fr' : 'repeat('+props.components.length+', 1fr)')
        };
    }

    const renderBulkActions = () => {
        if (!state.selectedRowIds.length) {
            return null;
        }

        return props.bulkActions.map((component, i) => {
            return (
                <div className="index__header-bulk-action" key={i}>
                    {components.renderComponent(component, {}, {
                        ...props.path,
                        params: {
                            id: state.selectedRowIds
                        }
                    })}
                </div>
            );
        });
    };

    const renderHeader = () => {
        return (
            <div className="index__header">
                <div className="index__header-title">
                    {str.toUpperCaseFirst(props.plural)} {state.meta ? '('+state.meta.total+')' : null}
                </div>
                <div className="index__header-options">
                    {renderBulkActions()}
                    {(props.search ? (
                        <div className="index__header-search">
                            <Search value={location.current.params.search} onSearch={keyword => search(keyword)}/>
                        </div>) : null)}
                    {<FiltersTool path={props.path} filters={props.filters} data={location.current.params} onChange={params => filter(params)}/>}
                </div>
            </div>
        );
    }

    const renderFooter = () => {

        if (! state.meta || ! state.meta.total) {
            return null;
        }

        return (
            <div className="index__footer">
                <Pagination
                    currentPage={state.meta.current_page}
                    lastPage={state.meta.last_page}
                    perPage={state.meta.per_page}
                    total={state.meta.total}
                    from={state.meta.from}
                    to={state.meta.to}
                    onPageChange={changePage}
                />
            </div>
        );
    }

    const renderPlaceholder = () => {

        if (props.path.params.search) {
            return (
                <div className="index__placeholder">
                    {i18n.get('snippets.no_plural_found_for_search', {plural: props.plural, search: props.path.params.search})}
                </div>
            );
        }

        return (
            <div className="index__placeholder">
                {i18n.get('snippets.no_plural_found', {plural: props.plural})}
            </div>
        );
    }

    const renderRows = () => {
        if (state.rows.length) {
            return (
                <div className="index__rows">
                    {state.rows.map(row => {
                        return (
                            <div className="index__row" key={row.id}>
                                {renderRow(row)}
                            </div>
                        );
                    })}
                </div>
            );
        }
        return renderPlaceholder();
    }

    const toggleRowSelection = (row) => {
        if(state.selectedRowIds.includes(row.id)) {
            setState({
                ...state,
                selectedRowIds: state.selectedRowIds.filter(rowId => rowId !== row.id)
            });
            return;
        }

        setState({
            ...state,
            selectedRowIds: [
                ...state.selectedRowIds,
                row.id
            ]
        });
    };

    const onCtxRowClick = (action, row) => {
        if (action === 'open_new') {
            path.goTo(props.path.module, props.action, {
                id: row.id
            }, true);
        }
    };

    const renderRow = (row) => {

        const rowCheckbox = (props.bulkActions.length ? (
            <div className="index-row__checkbox">
                <Checkbox checked={state.selectedRowIds.includes(row.id)} onClick={e => toggleRowSelection(row)} />
            </div>
        ) : null);

        const rowContent = props.components.map((component, i) => {
            return (
                <div className="index-row__component" key={i}>
                    {components.renderComponent(component, row, props.path)}
                </div>
            );
        });

        const rowActions = props.actions.map((component, i) => {
            return (
                <div className="index-row__action" key={i}>
                    {components.renderComponent(component, row, props.path)}
                </div>
            );
        });

        const indexRow = (
            <div className={clsx(`index-row index-row--${props.style}`, {
                'index-row--clickable': props.action,
                'index-row--selected': state.selectedRowIds.includes(row.id)
            })} onClick={props.action ? () => onRowClick(row) : null}>
                {rowCheckbox}
                <div className="index-row__content" style={props.style === 'default' ? getRowStyle() : {}}>
                    {rowContent}
                </div>
                <div className="index-row__actions">
                    {rowActions}
                </div>
            </div>
        );

        if (! props.action) {
            return indexRow;
        }

        return (
            <ContextMenu onClick={action => onCtxRowClick(action, row)} links={[['Open in new window', 'open_new']]}>
                {indexRow}
            </ContextMenu>
        );
    }

    const changePage = (page) => {
        path.goTo(location.current.module, location.current.action, {
            ...location.current.params,
            page
        });
    }

    const search = (search) => {
        path.goTo(location.current.module, location.current.action, {
            ...location.current.params,
            page: 1,
            search
        });
    }

    const filter = (params) => {
        path.goTo(location.current.module, location.current.action, {
            ...(props.path.params.search) && {search: props.path.params.search},
            ...(props.path.params.page) && {page: 1},
            ...params
        });
    }

    const clearFilters = () => {
        path.goTo(location.current.module, location.current.action, {});
    }

    const render = () => {
        return (
            <div className={'index index--'+props.style+(state.isLoading ? ' index--loading' : '')}>
                {renderHeader()}
                {renderRows()}
                {renderFooter()}
            </div>
        );
    }

    return render();
}

Index.defaultProps = {
    type: '',
    components: [],
    actions: [],
    bulkActions: [],
    path: {},
    id: 0,
    data: {},
    params: {},
    search: false,
    relationship: false,
    filters: [],
    sorter: null,
    restrictByFk: null,
    action: '',
    style: 'default',
    plural: '',
    singular: ''
};

export default Index;
