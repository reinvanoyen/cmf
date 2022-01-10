import React from 'react';
import api from "../../api/api";
import Button from "./button";
import IconButton from "./icon-button";
import Placeholder from "./placeholder";
import str from "../../util/str";
import Item from "./item";

class ItemPickerWidget extends React.Component {

    static defaultProps = {
        id: 0,
        path: {},
        titleColumn: '',
        components: [],
        defaultSelectedItemIds: [],
        defaultSelectedItems: [],
        onSelectionChange: (ids, items) => {},
        onSelectionConfirm: (ids, items) => {},
        onCancel: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            items: [],
            selectedItemIds: this.props.defaultSelectedItemIds || [],
            selectedItems: this.props.defaultSelectedItems || []
        };
    }

    componentDidMount() {
        this.load();
    }

    load() {
        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'load', this.props.path.params).then(response => {
            let items = response.data.data;
            this.setState({
                items: items,
                isLoading: false
            });
        });
    }

    onSelectionChange(ids, items) {
        this.setState({
            selectedItemIds: ids,
            selectedItems: items
        });
        this.props.onSelectionChange(ids, items);
    }

    onSelectionConfirm() {
        this.props.onSelectionConfirm(this.state.selectedItemIds, this.state.selectedItems);
    }

    deselect(item) {

        let itemIds = this.state.selectedItemIds.filter(itemId => itemId !== item.id);
        let items = this.state.selectedItems.filter(currItem => currItem.id !== item.id);

        this.setState({
            selectedItemIds: itemIds,
            selectedItems: items
        }, () => {
            this.props.onSelectionChange(this.state.selectedItemIds, this.state.selectedItems);
        });
    }

    select(item) {
        this.setState({
            selectedItemIds: [...this.state.selectedItemIds, item.id],
            selectedItems: [...this.state.selectedItems, item]
        }, () => {
            this.props.onSelectionChange(this.state.selectedItemIds, this.state.selectedItems);
        });
    }

    toggleItemSelection(item) {
        if (this.isItemSelected(item)) {
            this.deselect(item);
        } else {
            this.select(item);
        }
    }

    isItemSelected(item) {
        return this.state.selectedItemIds.includes(item.id);
    }

    onCancel() {
        this.props.onCancel();
    }

    renderSidebar() {
        if (this.state.selectedItems.length) {
            return (
                <div className={'item-picker-widget__selection'}>
                    <div className="item-picker-widget__selection-header">
                        Your selection ({this.state.selectedItems.length})
                    </div>
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

        return (
            <div className={'item-picker-widget__selection'}>
                <div className="item-picker-widget__selection-header">
                    Your selection ({this.state.selectedItems.length})
                </div>
                <Placeholder icon={'checklist'}>
                    Your selection is empty
                </Placeholder>
            </div>
        );
    }

    renderContent() {
        if (this.state.isLoading) {
            return null;
        }

        return (
            <React.Fragment>
                <div className="item-picker-widget__main">
                    {this.state.items.map((item, i) => {
                        return (
                            <Item
                                key={i}
                                path={this.props.path}
                                item={item}
                                titleColumn={this.props.titleColumn}
                                components={this.props.components}
                                isSelected={this.isItemSelected(item)}
                                selectionMode={true}
                                onClick={e => this.toggleItemSelection(item)}
                            />
                        );
                    })}
                </div>
                <div className="item-picker-widget__side">
                    {this.renderSidebar()}
                </div>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className="item-picker-widget">
                <div className="item-picker-widget__header">
                    <div className="item-picker-widget__header-title">
                        {str.toUpperCaseFirst(this.props.plural)}
                    </div>
                    <div className="item-picker-widget__header-options">
                        <IconButton name={'close'} onClick={this.onCancel.bind(this)} />
                    </div>
                </div>
                <div className="item-picker-widget__content">
                    {this.renderContent()}
                </div>
                <div className="item-picker-widget__footer">
                    <Button
                        text={'Cancel'}
                        style={['secondary']}
                        onClick={this.onCancel.bind(this)}
                    />
                    <Button
                        text={(this.props.selectionMode ? 'Confirm selection' : 'Select '+this.props.singular)}
                        style={this.state.selectedItemIds.length ? [] : ['disabled',]}
                        onClick={this.state.selectedItemIds.length ? this.onSelectionConfirm.bind(this) : null}
                    />
                </div>
            </div>
        );
    }
}

export default ItemPickerWidget;
