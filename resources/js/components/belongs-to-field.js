import React from 'react';
import Field from '../core/ui/field';
import Button from '../core/ui/button';
import api from '../api/api';
import Form from "../core/ui/form";
import components from "../rendering/components";
import ui from "../core/ui/util";
import Select from "../core/ui/select";
import Overlay from "../core/ui/overlay";
import Window from "../core/ui/window";
import i18n from "../util/i18n";

class BelongsToField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        titleColumn: '',
        nullable: false,
        plural: '',
        singular: '',
        tooltip: '',
        create: false,
        createComponents: [],
        sidebarComponents: []
    };

    constructor(props) {
        super(props);

        this.state = {
            createFormErrors: {},
            value: (this.props.data[this.props.name] ? this.props.data[this.props.name].id : ''),
            options: {},
            isOpen: false
        };

        this.createFormRef = React.createRef();
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value;
    }

    getData(data) {
        data[this.props.name] = (this.state.value ? this.state.options.find(opt => opt.id === this.state.value) : null);
        return data;
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            if (this.props.data[this.props.name]) {
                this.setState({
                    value: this.props.data[this.props.name].id
                });
            }
        }
    }

    componentDidMount() {
        this.load();
    }

    load(cb = null) {
        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'load', this.props.path.params).then(response => {

            let data = response.data.data;
            let options = {};
            data.forEach(item => options[item.id] = item[this.props.titleColumn]);

            let value = this.state.value ? this.state.value : (this.props.nullable ? '' : data[0].id);

            // Set the data to the state
            this.setState({value, options}, () => {
                if (cb) {
                    cb();
                }
            });
        });
    }

    handleChange(value) {
        this.setState({value});
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

    create(data) {

        // Post the data to the backend
        api.execute.post(this.props.path, this.props.id, 'create', data)
            .then(response => {
                // Set the form to ready
                this.createFormRef.current.ready();

                this.load(() => {
                    this.setState({
                        isOpen: false,
                        value: response.data.data.id
                    });
                });

                // Notify the user
                ui.notify(i18n.get('snippets.singular_created_selected', {singular: this.props.singular}));

            }, error => {

                let response = error.response;

                // Set the form to ready
                this.createFormRef.current.ready();

                // Set the error messages
                this.setState({
                    createFormErrors: response.data.errors
                });
                // Notify the user
                ui.notify(response.data.message);
            });
    }

    renderSidebarComponents() {
        return components.renderComponents(this.props.sidebarComponents, {}, this.props.path)
    }

    renderCreateComponents() {
        return components.renderComponents(this.props.createComponents, {}, this.props.path)
    }

    renderCreateWidget() {
        if (this.state.isOpen) {
            return (
                <Overlay>
                    <Window title={i18n.get('snippets.new_singular', {singular: this.props.singular})} style={'modal'} closeable={true} onClose={this.close.bind(this)}>
                        <Form
                            ref={this.createFormRef}
                            errors={this.state.createFormErrors}
                            realForm={false}
                            onSubmit={this.create.bind(this)}
                            submitButtonText={i18n.get('snippets.create_singular', {singular: this.props.singular})}
                            sidebar={this.renderSidebarComponents()}
                        >
                            {this.renderCreateComponents()}
                        </Form>
                    </Window>
                </Overlay>
            );
        }

        return null;
    }

    renderCreate() {
        if (this.props.create) {
            return (
                <div className="belongs-to-field__btn">
                    <Button
                        icon={'add'}
                        style={['full', 'small', 'secondary']}
                        text={i18n.get('snippets.new_singular', {singular: this.props.singular})}
                        onClick={this.open.bind(this)}
                    />
                </div>
            );
        }
        return null;
    }

    render() {
        return (
            <Field
                name={this.props.name}
                label={this.props.label}
                tooltip={this.props.tooltip}
            >
                <div className={'belongs-to-field'}>
                    <div className="belongs-to-field__field">
                        <Select
                            nullable={this.props.nullable}
                            nullText={'– '+i18n.get('snippets.no_singular_selected', {singular: this.props.singular})+' –'}
                            options={this.state.options}
                            value={this.state.value}
                            onChange={value => this.handleChange(value)}
                        >
                            {this.renderCreate()}
                        </Select>
                    </div>
                </div>
                {this.renderCreateWidget()}
            </Field>
        );
    }
}

export default BelongsToField;
