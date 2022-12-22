import React from 'react';
import api from "../../api/api";
import Button from "./button";
import IconButton from "./icon-button";
import Placeholder from "./placeholder";
import str from "../../util/str";
import Item from "./item";
import Search from "./search";
import StickySidebar from "./sticky-sidebar";
import Window from "./window";
import i18n from "../../util/i18n";

class ItemPickerWidget extends React.Component {

    static defaultProps = {
        id: 0,
        path: {},
        titleColumn: '',
        components: [],
        defaultSelectedItemIds: [],
        defaultSelectedItems: [],
        search: false,
        onSelectionChange: (ids, items) => {},
        onSelectionConfirm: (ids, items) => {},
        onCancel: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            searchKeyword: '',
            items: [],
            selectedItemIds: this.props.defaultSelectedItemIds || [],
            selectedItems: this.props.defaultSelectedItems || []
        };
    }

    componentDidMount() {
        this.load();
    }

    load() {

        let params = {};

        // Search for search keyword
        if (this.state.searchKeyword) {
            params.search = this.state.searchKeyword;
        }

        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'load', params).then(response => {
            let items = response.data.data;
            this.setState({
                items: items,
                isLoading: false
            });
        });
    }

    search(keyword) {
        this.setState({
            isLoading: true,
            searchKeyword: keyword
        }, () => {
            this.load();
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

    onCancel() {
        this.props.onCancel();
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
                    {i18n.get('snippets.your_selection')} ({this.state.selectedItems.length})
                </div>
                <Placeholder icon={'checklist'}>
                    {i18n.get('snippets.your_selection_is_empty')}
                </Placeholder>
            </div>
        );
    }


    renderPlaceholder() {
        if (this.state.searchKeyword) {
            return (
                <div className="index__placeholder">
                    {i18n.get('snippets.no_plural_found_for_search', {plural: this.props.plural, search: this.state.searchKeyword})}
                </div>
            );
        }

        return (
            <div className="index__placeholder">
                {i18n.get('snippets.no_plural_found', {plural: this.props.plural})}
            </div>
        );
    }

    renderRows() {
        if (! this.state.isLoading) {
            return this.state.items.map((item, i) => {
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
            });
        }
    }

    render() {
        return (
            <Window
                style={['modal', 'wide']}
                title={str.toUpperCaseFirst(this.props.plural)}
                closeable={true}
                onClose={this.onCancel.bind(this)}
                actions={[(this.props.search ? <Search onSearch={keyword => this.search(keyword)} /> : null)]}
                footer={[
                    <Button
                        key={'cancel'}
                        text={i18n.get('snippets.cancel')}
                        style={['secondary']}
                        onClick={this.onCancel.bind(this)}
                    />,
                    <Button
                        key={'confirm'}
                        text={(this.props.selectionMode ? i18n.get('snippets.confirm_selection') : i18n.get('select_singular', {singular: this.props.singular}))}
                        style={this.state.selectedItemIds.length ? [] : ['disabled',]}
                        onClick={this.state.selectedItemIds.length ? this.onSelectionConfirm.bind(this) : null}
                    />
                ]}
            >
                <StickySidebar sidebar={this.renderSidebar()}>
                    {this.state.items.length ? this.renderRows() : this.renderPlaceholder()}
                </StickySidebar>
            </Window>
        );
    }
}

export default ItemPickerWidget;
