import React, { useEffect, useState } from 'react';
import components from "../rendering/components";
import filters from "../rendering/filters";
import api from "../api/api";
import path from "../state/path";
import Pagination from "../core/ui/pagination";
import Search from "../core/ui/search";
import Link from "../core/ui/link";
import str from "../util/str";
import i18n from "../util/i18n";
import ContextMenu from "../core/ui/context-menu";
import util from "../core/ui/util";
import usePrevious from "../hooks/use-previous";
import useOnMount from "../hooks/use-on-mount";
import {useSelector} from "react-redux";

function Index(props) {

    const [state, setState] = useState({
        isLoading: true,
        rows: [],
        meta: null,
        searchKeyword: null,
        filterParams: {},
        hasActiveFilters: false
    });

    const prevDataId = usePrevious(props.data.id);
    const { refresh } = useSelector(state => state.location);

    let filterList = [];

    /*
    useOnMount(() => {
        if (! props.restrictByFk && ! props.relationship) {
            load();
        }
    });
    */

    useEffect(() => {
        if (props.restrictByFk || props.relationship) {
            if (props.data.id !== prevDataId) {
                load();
            }
        }
    });

    useEffect(() => {
        load();
    }, [state.searchKeyword, state.filterParams]);

    useEffect(() => {
        if (refresh) {
            load();
        }
    }, [refresh]);

    const load = async (params = {}) => {

        // Add FK to the params
        if (props.restrictByFk) {
            params.foreign = props.data.id;
        }

        // Add the current data id to the params because we need it to fetch the relationship
        if (props.relationship) {
            params.relation = props.data.id;
        }

        // Search for search keyword
        if (state.searchKeyword) {
            params.search = state.searchKeyword;
        }

        // If filter params are set, add them to the http params
        if (state.filterParams) {
            for (let filterId in state.filterParams) {
                if (state.filterParams.hasOwnProperty(filterId)) {
                    params['filter_'+filterId] = state.filterParams[filterId];
                }
            }
        }

        // Execute the get request
        const response = await api.execute.get(props.path, props.id,'load', params);

        setState({
            ...state,
            isLoading: false,
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

        const rowStyle = {
            gridTemplateColumns: 'repeat('+props.components.length+', 1fr)'
        };

        if (props.grid.length) {
            rowStyle.gridTemplateColumns = props.grid.join('fr ')+'fr';
        }

        return rowStyle;
    }

    const renderFilters = () => {

        filterList = filters.renderFiltersWith(props.filters, {}, props.path, (filter, i) => {
            return (
                <div className="index__header-filter" key={i}>
                    {filter}
                </div>
            );
        }, onFilterChange, true);

        return filterList.map(obj => obj.filter);
    }

    const renderFiltersTool = () => {

        if (props.filters.length) {
            return (
                <div className="index__header-filters-tool">
                    {renderFilters()}
                    <div className="index__header-clear-filters">
                        <Link
                            onClick={state.hasActiveFilters ? clearFilters : null}
                            text={i18n.get('snippets.clear_filters')}
                            style={state.hasActiveFilters ? '' : 'disabled'}
                        />
                    </div>
                </div>
            );
        }

        return null;
    }

    const renderHeader = () => {

        const indexSearch = (props.search ? <div className="index__header-search"><Search onSearch={keyword => search(keyword)}/></div> : null);

        return (
            <div className="index__header">
                <div className="index__header-title">
                    {str.toUpperCaseFirst(props.plural)} {state.meta ? '('+state.meta.total+')' : null}
                </div>
                <div className="index__header-options">
                    {indexSearch}
                    {renderFiltersTool()}
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

        if (state.searchKeyword) {
            return (
                <div className="index__placeholder">
                    {i18n.get('snippets.no_plural_found_for_search', {plural: props.plural, search: state.searchKeyword})}
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
                        let rowContent = props.components.map((component, i) => {
                            return (
                                <div className="index__component" key={i}>
                                    {components.renderComponent(component, row, props.path)}
                                </div>
                            );
                        });

                        return (
                            <div className={'index__row'+(props.action ? ' index__row--clickable' : '')} key={row.id} style={getRowStyle()} onClick={props.action ? () => onRowClick(row) : null}>
                                {rowContent}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return renderPlaceholder();
    }

    const changePage = (page) => {
        load({page});
    }

    const onFilterChange = (filterId, filterValue) => {

        let { filterParams } = state;

        if (filterValue) {
            filterParams[filterId] = filterValue;
        } else {
            delete filterParams[filterId];
        }

        setState({
            ...state,
            filterParams,
            hasActiveFilters: (Object.keys(filterParams).length !== 0)
        });
    }

    const clearFilters = () => {
        filterList.forEach(obj => obj.ref.current.clear());
    }

    const search = (keyword) => {
        setState({
            ...state,
            searchKeyword: keyword
        });
    }

    const onCtxMenuClick = (action) => {
        if (action === 'refresh') {
            load();
            util.i18nNotify('snippets.reloaded_plural', {plural: props.plural});
        } else if (action === 'clearFilters') {
            clearFilters();
        }
    }

    const render = () => {
        return (
            <ContextMenu onClick={onCtxMenuClick} links={[
                ['Reload '+props.plural, 'refresh'],
                (state.hasActiveFilters ? ['Clear filters', 'clearFilters'] : null)
            ]}>
                <div className={'index index--'+props.style+(state.isLoading ? ' index--loading' : '')}>
                    {renderHeader()}
                    {renderRows()}
                    {renderFooter()}
                </div>
            </ContextMenu>
        );
    }

    return render();
}

Index.defaultProps = {
    type: '',
    components: [],
    path: {},
    id: 0,
    data: {},
    params: null,
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
