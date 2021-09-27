import React from 'react';
import components from "../rendering/components";

class Stack extends React.Component {

    static defaultProps = {
        components: [],
        path: {},
        data: {},
        direction: '',
        gapless: false,
        grid: null
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

    getStackStyle() {

        if (! this.props.grid) {
            return {};
        }

        return {
            gridTemplateColumns: this.props.grid.join('fr ')+'fr'
        };
    }

    render() {

        this.componentList = components.renderComponentsWith(this.props.components, this.props.data, this.props.path, (component, i) => {
            return (
                <div className="stack__component" key={i}>
                    {component}
                </div>
            );
        }, true);

        let componentListRenders = this.componentList.map(obj => obj.component);

        return (
            <div className={'stack stack--'+this.props.direction+(this.props.gapless ? ' stack--gapless' : '')} style={this.getStackStyle()}>
                {componentListRenders}
            </div>
        );
    }
}

export default Stack;
