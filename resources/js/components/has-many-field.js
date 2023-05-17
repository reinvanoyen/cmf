import React from 'react';
import Field from "../core/ui/field";
import Button from "../core/ui/button";
import IconButton from "../core/ui/icon-button";
import Placeholder from "../core/ui/placeholder";
import components from "../rendering/components";
import Collapsible from "../core/ui/collapsible";
import i18n from "../util/i18n";

class HasManyField extends React.Component {

    static defaultProps = {
        path: {},
        data: {},
        components: [],
        label: '',
        name: '',
        style: '',
        singular: '',
        plural: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            idsToRemove: [],
            rows: this.props.data[this.props.name] || []
        };

        this.componentLists = [];
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                rows: this.props.data[this.props.name] || []
            });
        }
    }

    getData(data) {
        data[this.props.name] = this.state.rows || [];
        return data;
    }

    handleSubmit(data) {

        let payload = {
            delete: this.state.idsToRemove,
            update: {},
            create: []
        };

        this.componentLists.forEach((componentListData, index) => {

            let [componentList, id] = componentListData;

            let data = {};
            componentList.forEach(obj => obj.ref.current.handleSubmit(data));

            if (id) {
                payload.update[id] = data;
            } else {
                payload.create.push(data);
            }
        });

        data[this.props.name] = JSON.stringify(payload);
    }

    remove(index) {

        let rows = this.state.rows;
        let id = rows[index].id;

        rows.splice(index, 1);

        this.setState({
            idsToRemove: [...this.state.idsToRemove, id],
            rows
        });
    }

    create() {

        let rows = this.state.rows;

        rows.push({});

        this.setState({
            rows
        });
    }

    renderComponents(item) {

        let data = item || {};

        let componentList = components.renderComponentsWith(this.props.components, data, this.props.path, (component, i) => {
            return (
                <div className="many-to-many-field__pivot-component" key={i}>
                    {component}
                </div>
            );
        }, true);

        this.componentLists.push([componentList, item.id || null]);

        return componentList.map(obj => obj.component);
    }

    renderContent() {

        this.componentLists = [];

        if (this.state.rows.length) {
            return (
                <div className={'many-to-many-field__list'}>
                    {this.state.rows.map((item, i) => {
                        return (
                            <Collapsible title={this.props.singular+' '+(i+1)} key={i} actions={[
                                <IconButton
                                    key={'delete'}
                                    name={'delete'}
                                    style={'transparent'}
                                    onClick={e => this.remove(i)}
                                />
                            ]}>
                                {this.renderComponents(item)}
                            </Collapsible>
                        );
                    })}
                </div>
            );
        }

        return (
            <Placeholder icon={'image_search'} onClick={this.create.bind(this)}>
                Create {this.props.singular}
            </Placeholder>
        );
    }

    render() {
        return (
            <Field name={this.props.name} label={this.props.label} errors={this.props.errors}>
                <div className="many-to-many-field">
                    <div className="many-to-many-field__btn">
                        <Button style={['small', 'secondary']} icon={'add'} text={i18n.get('snippets.add_singular', {singular: this.props.singular})} onClick={this.create.bind(this)}/>
                    </div>
                    <div className="many-to-many-field__content">
                        {this.renderContent()}
                    </div>
                </div>
            </Field>
        );
    }
}

export default HasManyField;
