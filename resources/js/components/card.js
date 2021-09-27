import React from 'react';
import components from "../rendering/components";

class Card extends React.Component {

    static defaultProps = {
        data: {},
        titleField: '',
        photoCollection: ''
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

    renderComponents() {

        if (! this.props.components.length) {
            return null;
        }

        this.componentList = components.renderComponentsWith(this.props.components, this.props.data, this.props.path, (component, i) => {
            return (
                <div className="card__component" key={i}>
                    {component}
                </div>
            );
        }, true);

        let componentListRenders = this.componentList.map(obj => obj.component);

        return (
            <div className={'card__content'}>
                {componentListRenders}
            </div>
        );
    }

    render() {

        return (
            <div className={'card'}>
                <div className="card__photo">
                    <img src={this.props.data[this.props.photoCollection]} />
                </div>
                <div className="card__main">
                    <div className="card__title">
                        {this.props.data[this.props.titleField]}
                    </div>
                    {this.renderComponents()}
                </div>
            </div>
        );
    }
}

export default Card;
