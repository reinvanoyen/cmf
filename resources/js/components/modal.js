import React from 'react';
import components from "../rendering/components";
import Overlay from "../core/ui/overlay";
import Button from "../core/ui/button";
import Window from "../core/ui/window";
import Field from "../core/ui/field";
import UiLink from "../core/ui/link";

class Modal extends React.Component {

    static defaultProps = {
        title: '',
        label: '',
        components: [],
        path: {},
        data: {},
        errors: {},
        style: null
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
        this.componentList.forEach(obj => {
            obj.ref.current.handleSubmit(data);
        });
    }

    getData(data) {
        this.componentList.forEach(obj => {
            if (obj.ref.current.getData) {
                obj.ref.current.getData(data);
            }
        });
        return data;
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

    store(cb = null) {

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
        }, () => {
            if (cb) {
                cb();
            }
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
                        <Button key={'confirm'} text={'Confirm'} onClick={() => {
                            this.store();
                        }} />
                    ]}
                >
                    {this.renderComponents()}
                </Window>
            </Overlay>
        );
    }

    render() {
        return (
            <React.Fragment>
                <Field
                    label={this.props.label}
                    tooltip={this.props.tooltip}
                >
                    {this.props.style === 'link' ?
                        <UiLink style={this.props.style} onClick={this.open.bind(this)} text={this.props.title} />
                        : <Button style={['small', 'secondary']} text={this.props.title} onClick={this.open.bind(this)} />}
                </Field>
                <div style={{display: (this.state.isOpen ? 'block' : 'none')}}>
                    {this.renderWidget()}
                </div>
            </React.Fragment>
        );
    }
}

export default Modal;
