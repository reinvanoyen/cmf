import React from 'react';
import components from "../rendering/components";

class Foreign extends React.Component {

    static defaultProps = {
        components: [],
        path: {},
        data: {},
    };

    constructor(props) {
        super(props);

        this.componentList = [];
    }

    handleSubmit(data) {
        this.componentList.forEach(obj => {
            obj.ref.current.handleSubmit(data);
        });
    }

    getData(data) {
        this.componentList.forEach(obj => {
            obj.ref.current.getData(data);
        });
        return data;
    }

    render() {

        this.componentList = components.renderComponentsWith(this.props.components, this.props.data, this.props.path, (component, i) => {
            return (
                <div className="foreign__component" key={i}>
                    {component}
                </div>
            );
        }, true, this.props.errors);

        let componentListRenders = this.componentList.map(obj => obj.component);

        return (
            <div className="foreign">
                {componentListRenders}
            </div>
        );
    }
}

export default Foreign;
