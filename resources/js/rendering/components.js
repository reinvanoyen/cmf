import React from 'react';
import all from "../components/all";

export default {
    renderComponent(component, data, path) {
        if (component) {
            const Component = all[component.type];
            return (
                <Component {...component} data={data} path={path} />
            );
        }
    },
    renderComponents(components, data, path) {
        return components.map((component, i) => {
            const Component = all[component.type];
            return (
                <Component {...component} data={data} path={path} key={i} />
            );
        });
    },
    renderComponentsWith(components, data, path, renderCallback, refs = false) {

        return components.map((component, i) => {

            let ref = null;

            if (refs) {
                ref = React.createRef();
            }

            let Component = all[component.type];
            let rendered = renderCallback(<Component {...component} data={data} path={path} ref={ref} />, i);

            return {
                component: rendered,
                ref: ref
            };
        });
    }
};
