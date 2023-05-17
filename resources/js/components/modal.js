import React from 'react';
import components from "../rendering/components";
import Overlay from "../core/ui/overlay";
import Button from "../core/ui/button";
import Window from "../core/ui/window";
import Field from "../core/ui/field";

class Modal extends React.Component {

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
            isOpen: false,
            isStored: false,
            data: {},
            submitData: {}
        };
    }

    handleSubmit(data) {
        Object.assign(data, this.state.submitData);
    }

    open() {
        this.setState({
            isOpen: true
        });
    }

    close() {
        this.setState({
            isOpen: false
        });
    }

    store() {

        let data = {};
        let submitData = {};
        this.componentList.forEach(obj => {
            if (obj.ref.current.getData) {
                obj.ref.current.getData(data);
            }
            if (obj.ref.current.handleSubmit) {
                obj.ref.current.handleSubmit(submitData);
            }
        });

        this.setState({
            isStored: true,
            data,
            submitData,
            isOpen: false
        });
    }

    renderComponents() {

        this.componentList = components.renderComponentsWith(this.props.components, (this.state.isStored ? this.state.data : this.props.data), this.props.path, (component, i) => {
            return (
                <div className="content-blocks__component" key={i}>
                    {component}
                </div>
            );
        }, true);

        return this.componentList.map(obj => obj.component);
    }

    renderWidget() {
        return (
            <Overlay>
                <Window
                    title={this.props.title}
                    style={'modal'}
                    closeable={true}
                    onClose={this.close.bind(this)}
                    footer={[
                        <Button key={'confirm'} text={'Confirm'} onClick={this.store.bind(this)} />
                    ]}
                >
                    {this.renderComponents()}
                </Window>
            </Overlay>
        );
    }

    render() {

        let widget;

        if (this.state.isOpen) {
            widget = this.renderWidget();
        }

        return (
            <React.Fragment>
                <Field
                    label={this.props.label || this.props.title}
                    tooltip={this.props.tooltip}
                >
                    <Button style={['small', 'secondary']} text={this.props.title} onClick={this.open.bind(this)} />
                </Field>
                {widget}
            </React.Fragment>
        );
    }
}

export default Modal;
