import React from 'react';
import Field from "../core/ui/field";
import Button from "../core/ui/button";
import IconButton from "../core/ui/icon-button";
import Placeholder from "../core/ui/placeholder";
import ItemPickerWidget from "../core/ui/item-picker-widget";
import Overlay from "../core/ui/overlay";
import components from "../rendering/components";
import Collapsible from "../core/ui/collapsible";
import util from "../core/ui/util";
import i18n from "../util/i18n";

class ManyToManyField extends React.Component {

    static defaultProps = {
        path: {},
        data: {},
        components: [],
        pivotComponents: [],
        label: '',
        name: '',
        style: '',
        singular: '',
        plural: '',
        titleColumn: '',
        search: false,
        filters: [],
        grid: []
    };

    constructor(props) {

        super(props);

        this.state = {
            isOpen: false,
            selectedItems: this.props.data[this.props.name] || [],
            selectedItemsIds: (this.props.data[this.props.name] ? this.props.data[this.props.name].map(item => item.id) : [])
        };

        this.pivotComponentLists = [];
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                selectedItems: this.props.data[this.props.name] || [],
                selectedItemsIds: (this.props.data[this.props.name] ? this.props.data[this.props.name].map(item => item.id) : [])
            });
        }
    }

    getData(data) {
        data[this.props.name] = this.state.selectedItems || [];
        return data;
    }

    handleSubmit(data) {

        let payload = {
            ids: this.state.selectedItemsIds || []
        };

        let pivotPayload = {};

        this.pivotComponentLists.forEach((componentListData, index) => {

            let [componentList, id] = componentListData;

            if (this.state.selectedItemsIds.includes(id)) {
                let data = {};
                componentList.forEach(obj => obj.ref.current.handleSubmit(data));
                pivotPayload[id] = data;
            }
        });

        payload['pivot'] = pivotPayload;

        data[this.props.name] = JSON.stringify(payload);
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

    deselect(item) {

        util.confirm({
            title: i18n.get('snippets.delete_singular_title', {singular: this.props.singular}),
            text: i18n.get('snippets.delete_singular_text', {singular: this.props.singular}),
            confirm: () => {

                let itemIds = this.state.selectedItemsIds.filter(itemId => itemId !== item.id);
                let items = this.state.selectedItems.filter(currItem => currItem.id !== item.id);

                this.setState({
                    selectedItemsIds: itemIds,
                    selectedItems: items
                });

                util.notify(i18n.get('snippets.singular_deleted', {singular: this.props.singular}));
            }
        });
    }

    onSelectionConfirm(ids, files) {
        this.setState({
            isOpen: false,
            selectedItems: files,
            selectedItemsIds: ids
        });
    }

    renderPivotComponents(item) {

        let data = item.pivot || {};

        let componentList = components.renderComponentsWith(this.props.pivotComponents, data, this.props.path, (component, i) => {
            return (
                <div className="many-to-many-field__pivot-component" key={i}>
                    {component}
                </div>
            );
        }, true);

        this.pivotComponentLists.push([componentList, item.id]);

        return componentList.map(obj => obj.component);
    }

    renderContent() {

        this.pivotComponentLists = [];

        if (this.state.selectedItems.length) {
            return (
                <div className={'many-to-many-field__list'}>
                    {this.state.selectedItems.map((item, i) => {
                        return (
                            <Collapsible title={item[this.props.titleColumn]} key={i} actions={[
                                <IconButton
                                    key={'delete'}
                                    name={'delete'}
                                    style={'transparent'}
                                    onClick={e => this.deselect(item)}
                                />
                            ]}>
                                {this.renderPivotComponents(item)}
                            </Collapsible>
                        );
                    })}
                </div>
            );
        }

        return (
            <Placeholder icon={'image_search'} onClick={this.open.bind(this)}>
                Select {this.props.plural}
            </Placeholder>
        );
    }

    render() {

        let widget;

        if (this.state.isOpen) {
            widget = (
                <Overlay>
                    <ItemPickerWidget
                        id={this.props.id}
                        path={this.props.path}
                        plural={this.props.plural}
                        singular={this.props.plural}
                        titleColumn={this.props.titleColumn}
                        grid={this.props.grid}
                        components={this.props.components}
                        search={this.props.search}
                        filters={this.props.filters}
                        onCancel={this.close.bind(this)}
                        onSelectionConfirm={this.onSelectionConfirm.bind(this)}
                        defaultSelectedItems={this.state.selectedItems}
                        defaultSelectedItemIds={this.state.selectedItemsIds}
                    />
                </Overlay>
            );
        }

        return (
            <Field name={this.props.name} label={this.props.label} errors={this.props.errors}>
                <div className="many-to-many-field">
                    <div className="many-to-many-field__btn">
                        <Button style={['small', 'secondary']} icon={'add'} text={'Select '+this.props.plural} onClick={this.open.bind(this)} />
                    </div>
                    <div className="many-to-many-field__content">
                        {this.renderContent()}
                    </div>
                </div>
                {widget}
            </Field>
        );
    }
}

export default ManyToManyField;
