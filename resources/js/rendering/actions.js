import React from 'react';
import all from "../actions/all";

export default {
    renderAction(action, data, path) {
        if (action) {
            const Action = all[action.type];
            return (
                <Action {...action} path={path} data={data} key={path.action} />
            );
        }
    }
};
