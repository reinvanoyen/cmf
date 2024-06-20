import React, {useEffect, useState} from 'react';
import filters from "../../rendering/filters";
import Link from "./link";
import i18n from "../../util/i18n";

function FiltersTool(props) {

    const [state, setState] = useState({
        params: props.data,
        hasActiveFilters: false,
    });

    useEffect(() => {

        props.onChange(state.params);

        let hasActiveFilters = false;
        for (let i = 0; i < props.filters.length; i++) {
            if (state.params['filter_'+props.filters[i].id]) {
                hasActiveFilters = true;
            }
        }

        setState({...state, hasActiveFilters});

    }, [state.params]);

    const onFilterChange = (filterId, filterValue) => {

        if (filterValue) {
            setState({
                ...state,
                params: {
                    ...state.params,
                    ['filter_'+filterId]: filterValue
                }
            });
            return;
        }

        // Remove the filter
        const { ['filter_'+filterId]: removedProperty, ...params } = state.params;
        setState({
            ...state,
            params: {
                filters: true,
                ...params
            }
        });
    }

    const clear = () => {
        setState({
            ...state,
            params: {
                filters: true
            }
        });
    };

    const renderFilters = () => {
        const filterList = filters.renderFiltersWith(props.filters, props.data, props.path, (filter, i) => {
            return (
                <div className="filters-tool__filter" key={i}>
                    {filter}
                </div>
            );
        }, onFilterChange);
        return filterList.map(obj => obj.filter);
    };

    // If there's no filters, render nothing
    if (! props.filters.length) {
        return null;
    }

    return (
        <div className="filters-tool">
            <div className="filters-tool__filters">
                {renderFilters()}
            </div>
            <div className="filters-tool__clear">
                <Link
                    stopPropagation={false}
                    onClick={state.hasActiveFilters ? clear : null}
                    text={i18n.get('snippets.clear_filters')}
                    style={state.hasActiveFilters ? '' : 'disabled'}
                />
            </div>
        </div>
    );
}

FiltersTool.defaultProps = {
    onChange: () => {},
    data: {},
    path: {}
};

export default FiltersTool;
