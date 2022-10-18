import React from 'react';
import Field from "../core/ui/field";
import Select from "../core/ui/select";
import components from "../rendering/components";

export default class EnumSwitchField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        options: {},
        tooltip: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.data[this.props.name] || Object.keys(this.props.options)[0]
        };

        this.componentList = [];
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                value: this.props.data[this.props.name] || Object.keys(this.props.options)[0]
            });
        }
    }

    getData(data) {
        data[this.props.name] = this.state.value;

        this.componentList.forEach(obj => {
            obj.ref.current.getData(data);
        });

        return data;
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value;

        this.componentList.forEach(obj => {
            obj.ref.current.handleSubmit(data);
        });
    }

    handleChange(value) {
        this.setState({value});
    }

    getEnumOptions() {
        let options = {};
        Object.keys(this.props.options).forEach(key => options[key] = this.props.options[key].name);
        return options;
    }

    getEnumComponents() {
        return this.props.options[this.state.value].components;
    }

    render() {

        this.componentList = components.renderComponentsWith(this.getEnumComponents(), this.props.data, this.props.path, (component, i) => {
            return (
                <div className="enum-switch-field__component" key={i}>
                    {component}
                </div>
            );
        }, true, this.props.errors);

        let componentListRenders = this.componentList.map(obj => obj.component);

        return (
            <div className={'enum-switch-field'}>
                <Field
                    name={this.props.name}
                    required={false}
                    label={this.props.label}
                    tooltip={this.props.tooltip}
                >
                    <Select
                        value={this.state.value}
                        options={this.getEnumOptions()}
                        onChange={value => this.handleChange(value)}
                    />
                </Field>
                <div className={'enum-switch-field__content'}>
                    {componentListRenders}
                </div>
            </div>

        );
    }
}
