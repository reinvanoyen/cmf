import React from 'react';
import all from "../filters/all";

export default {
    renderFilter(filter, data, path) {
        if (filter) {
            const Filter = all[filter.type];
            return (
                <Filter {...filter} path={path} data={data} key={path.action} />
            );
        }
    },
    renderFilters(filters, data, path, onChangeHandler) {
        return filters.map((filter, i) => {
            const Filter = all[filter.type];
            return (
                <Filter {...filter} data={data} path={path} key={i} onChange={onChangeHandler} />
            );
        });
    },
    renderFiltersWith(filters, data, path, renderCallback, onChangeHandler, refs = false) {

        return filters.map((filter, i) => {

            let ref = (refs ? React.createRef() : null );
            let Filter = all[filter.type];

            let rendered = renderCallback(<Filter {...filter} data={data} path={path} onChange={onChangeHandler} ref={ref} />, i);

            return {
                filter: rendered,
                ref: ref
            };
        });
    }
};
