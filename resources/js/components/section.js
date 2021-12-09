import React from 'react';
import components from "../rendering/components";

class Section extends React.Component {

    static defaultProps = {
        title: '',
        components: [],
        path: {},
        data: {},
        errors: {}
    };

    constructor(props) {
        super(props);

        this.componentList = [];

        this.state = {
            open: true
        };
    }

    handleSubmit(data) {
        this.componentList.forEach(obj => {
            obj.ref.current.handleSubmit(data);
        });
    }

    toggle() {
        this.setState({
            open: !this.state.open
        });
    }

    render() {

        let title;

        if (this.props.title) {
            title = (
                <div className="section__header">
                    <div className="section__title">
                        {this.props.title}
                    </div>
                    <div className="section__collapse-button" onClick={this.toggle.bind(this)}></div>
                </div>
            );
        }

        this.componentList = components.renderComponentsWith(this.props.components, this.props.data, this.props.path, (component, i) => {
            return (
                <div className="section__component" key={i}>
                    {component}
                </div>
            );
        }, true, this.props.errors);

        let componentListRenders = this.componentList.map(obj => obj.component);

        return (
            <div className={'section section--'+(this.state.open ? 'open' : 'closed')}>
                {title}
                <div className="section__content">
                    {componentListRenders}
                </div>
            </div>
        );
    }
}

export default Section;
