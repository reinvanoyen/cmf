import React from 'react';
import FilePickerWidget from "../core/ui/file-picker-widget";
import Field from "../core/ui/field";
import Button from "../core/ui/button";
import IconButton from "../core/ui/icon-button";
import FilePreview from "../core/ui/file-preview";
import Placeholder from "../core/ui/placeholder";
import util from "../core/ui/util";
import array from "../util/array";
import FileThumb from "../core/ui/file-thumb";
import ItemPickerWidget from "../core/ui/item-picker-widget";
import api from "../api/api";
import Item from "../core/ui/item";

class ManyToManyField extends React.Component {

    static defaultProps = {
        path: {},
        data: {},
        components: [],
        label: '',
        name: '',
        style: '',
        singular: '',
        plural: '',
        titleColumn: '',
        search: false
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            selectedItems: this.props.data[this.props.name] || [],
            selectedItemsIds: (this.props.data[this.props.name] ? this.props.data[this.props.name].map(item => item.id) : [])
        };
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
        data[this.props.name] = this.state.selectedItemsIds || [];
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

        let itemIds = this.state.selectedItemsIds.filter(itemId => itemId !== item.id);
        let items = this.state.selectedItems.filter(currItem => currItem.id !== item.id);

        this.setState({
            selectedItemsIds: itemIds,
            selectedItems: items
        });
    }

    onSelectionConfirm(ids, files) {
        this.setState({
            isOpen: false,
            selectedItems: files,
            selectedItemsIds: ids
        });
    }

    renderContent() {

        if (this.state.selectedItems.length) {
            return (
                <div className={'many-to-many-field__list'}>
                    {this.state.selectedItems.map((item, i) => {
                        return (
                            <Item
                                key={i}
                                item={item}
                                titleColumn={this.props.titleColumn}
                                actions={[
                                    <IconButton
                                        key={'delete'}
                                        name={'delete'}
                                        style={'transparent'}
                                        onClick={e => this.deselect(item)}
                                    />
                                ]}
                            />
                        );
                    })}
                </div>
            );
        }

        return <Placeholder icon={'image_search'} onClick={this.open.bind(this)}>Select {this.props.plural}</Placeholder>;
    }

    render() {

        let widget;

        if (this.state.isOpen) {
            widget = (
                <div className="overlay">
                    <ItemPickerWidget
                        id={this.props.id}
                        path={this.props.path}
                        plural={this.props.plural}
                        singular={this.props.plural}
                        titleColumn={this.props.titleColumn}
                        components={this.props.components}
                        search={this.props.search}
                        onCancel={this.close.bind(this)}
                        onSelectionConfirm={this.onSelectionConfirm.bind(this)}
                        defaultSelectedItems={this.state.selectedItems}
                        defaultSelectedItemIds={this.state.selectedItemsIds}
                    />
                </div>
            );
        }

        return (
            <div className="many-to-many-field">
                <Field name={this.props.name} label={this.props.label} errors={this.props.errors}>
                    <div className="many-to-many-field__btn">
                        <Button style={['small', 'secondary']} icon={'add'} text={'Select '+this.props.plural} onClick={this.open.bind(this)} />
                    </div>
                    <div className="many-to-many-field__content">
                        {this.renderContent()}
                    </div>
                </Field>
                {widget}
            </div>
        );
    }
}

export default ManyToManyField;
