import React from 'react';
import components from "../rendering/components";

class Card extends React.Component {

    static defaultProps = {
        data: {},
        components: [],
        footer: [],
        titleField: '',
        subtitleField: '',
        labelField: '',
        booleanView: null,
        photo: ''
    };

    constructor(props) {
        super(props);
        this.componentList = [];
        this.footerComponentList = [];
    }

    handleSubmit(data) {
        this.componentList.forEach(obj => {
            obj.ref.current.handleSubmit(data);
        });
        this.footerComponentList.forEach(obj => {
            obj.ref.current.handleSubmit(data);
        });
    }

    renderBooleanView() {
        if (! this.props.booleanView) {
            return null;
        }

        return (
            <div className="card__boolean">
                {components.renderComponent(this.props.booleanView, this.props.data, this.props.path)}
            </div>
        );
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

    renderFooterComponents() {

        if (! this.props.footer.length) {
            return null;
        }

        this.footerComponentList = components.renderComponentsWith(this.props.footer, this.props.data, this.props.path, (component, i) => {
            return (
                <div className="card__component" key={i}>
                    {component}
                </div>
            );
        }, true);

        let componentListRenders = this.footerComponentList.map(obj => obj.component);

        return (
            <div className={'card__footer'}>
                {componentListRenders}
            </div>
        );
    }

    render() {

        let subtitle;
        let label;
        let photoStyle = {};

        if (this.props.data[this.props.photo] && this.props.data[this.props.photo].is_image) {
            photoStyle.backgroundImage = 'url('+this.props.data[this.props.photo].conversions.preview+')';
        }

        if (this.props.subtitleField && this.props.data[this.props.subtitleField]) {
            subtitle = (
                <div className="card__subtitle">
                    {this.props.data[this.props.subtitleField]}
                </div>
            );
        }

        if (this.props.labelField && this.props.data[this.props.labelField]) {
            label = (
                <div className="card__label">
                    {this.props.data[this.props.labelField]}
                </div>
            );
        }

        return (
            <div className={'card'}>
                <div className="card__photo" style={photoStyle}>
                    {label}
                    {this.renderBooleanView()}
                </div>
                <div className="card__main">
                    <div className="card__title">
                        {this.props.data[this.props.titleField]}
                    </div>
                    {subtitle}
                    {this.renderComponents()}
                </div>
                {this.renderFooterComponents()}
            </div>
        );
    }
}

export default Card;
