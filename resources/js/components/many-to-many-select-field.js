import React from 'react';
import Field from "../core/ui/field";
import Select from "../core/ui/select";
import api from "../api/api";
import ui from "../core/ui/util";
import Button from "../core/ui/button";
import IconButton from "../core/ui/icon-button";
import Form from "../core/ui/form";
import components from "../rendering/components";
import Overlay from "../core/ui/overlay";
import Window from "../core/ui/window";

class ManyToManySelectField extends React.Component {

    static defaultProps = {
        path: {},
        data: {},
        label: '',
        name: '',
        style: '',
        singular: '',
        plural: '',
        titleColumn: '',
        tooltip: '',
        create: false,
        createComponents: [],
        sidebarComponents: []
    };

    constructor(props) {
        super(props);

        this.state = {
            createFormErrors: {},
            isOpen: false,
            items: [],
            options: {},
            selectedItems: this.props.data[this.props.name] || [],
            selectedItemsIds: (this.props.data[this.props.name] ? this.props.data[this.props.name].map(item => item.id) : [])
        };

        this.createFormRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                selectedItems: this.props.data[this.props.name] || [],
                selectedItemsIds: (this.props.data[this.props.name] ? this.props.data[this.props.name].map(item => item.id) : [])
            });
        }
    }

    componentDidMount() {
        this.load();
    }

    load(cb = null) {
        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'load', this.props.path.params).then(response => {

            let items = response.data.data;
            let options = {};
            items.forEach(item => options[item.id] = item[this.props.titleColumn]);

            // Set the data to the state
            this.setState({items, options}, () => {
                if (cb) {
                    cb();
                }
            });
        });
    }

    getData(data) {
        data[this.props.name] = this.state.selectedItems || [];
        return data;
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.selectedItemsIds || [];
    }

    handleChange(values) {
        this.setState({
            selectedItemsIds: values,
            selectedItems: this.state.items.filter(v => values.includes(`${v.id}`))
        });
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
                        selectedItemsIds: [...this.state.selectedItemsIds, response.data.data.id]
                    });
                });

                // Notify the user
                ui.notify(`${this.props.singular} was created and selected`);

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
        return components.renderComponents(this.props.sidebarComponents, {}, this.props.path);
    }

    renderCreateComponents() {
        return components.renderComponents(this.props.createComponents, {}, this.props.path);
    }

    renderCreateWidget() {
        if (this.state.isOpen) {
            return (
                <Overlay>
                    <Window title={'New '+this.props.singular} style={'modal'} closeable={true} onClose={this.close.bind(this)}>
                        <Form
                            ref={this.createFormRef}
                            errors={this.state.createFormErrors}
                            realForm={false}
                            onSubmit={this.create.bind(this)}
                            submitButtonText={`Create ${this.props.singular}`}
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
                <div className="many-to-many-select-field__btn">
                    <Button
                        icon={'add'}
                        style={['full', 'small', 'secondary']}
                        text={'New '+this.props.singular}
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
                errors={this.props.errors}
            >
                <div className={'many-to-many-select-field'}>
                    <div className="many-to-many-select-field__field">
                        <Select
                            multiple={true}
                            value={this.state.selectedItemsIds}
                            options={this.state.options}
                            nullText={`– No ${this.props.plural} selected –`}
                            onChange={(values) => this.handleChange(values)}
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

export default ManyToManySelectField;
