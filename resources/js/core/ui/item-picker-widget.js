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
import Pagination from "./pagination";
import FiltersTool from "./filters-tool";
import filters from "../../rendering/filters";

class ItemPickerWidget extends React.Component {

    static defaultProps = {
        id: 0,
        path: {},
        titleColumn: '',
        grid: [],
        components: [],
        defaultSelectedItemIds: [],
        defaultSelectedItems: [],
        search: false,
        filters: [],
        onSelectionChange: (ids, items) => {},
        onSelectionConfirm: (ids, items) => {},
        onCancel: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            searchKeyword: '',
            hasActiveFilters: false,
            filterParams: {},
            items: [],
            meta: null,
            selectedItemIds: this.props.defaultSelectedItemIds || [],
            selectedItems: this.props.defaultSelectedItems || []
        };
    }

    componentDidMount() {
        this.load();
    }

    load(params = {}) {

        // Search for search keyword
        if (this.state.searchKeyword) {
            params.search = this.state.searchKeyword;
        }

        let hasActiveFilters = false;
        // If filter params are set, add them to the http params
        for (let i = 0; i < this.props.filters.length; i++) {
            let filter = this.props.filters[i];
            let filterId = filter.id;
            if (this.state.filterParams['filter_'+filterId]) {
                params['filter_'+filterId] = this.state.filterParams['filter_'+filterId];
                hasActiveFilters = true;
            }
        }

        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'load', params).then(response => {
            let items = response.data.data;
            this.setState({
                hasActiveFilters,
                isLoading: false,
                items: items,
                meta: response.data.meta || null
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

    filter(params) {
        this.setState({
            filterParams: params
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

    changePage(page) {
        this.load({
            page: page
        });
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

    renderPagination() {
        if (! this.state.meta || ! this.state.meta.total) {
            return null;
        }

        return (
            <Pagination
                key={'pagination'}
                currentPage={this.state.meta.current_page}
                lastPage={this.state.meta.last_page}
                perPage={this.state.meta.per_page}
                total={this.state.meta.total}
                from={this.state.meta.from}
                to={this.state.meta.to}
                onPageChange={this.changePage.bind(this)}
            />
        );
    }

    renderRows() {
        if (! this.state.isLoading) {
            return this.state.items.map((item, i) => {
                return (
                    <div key={i} className="item-picker-widget__row">
                        <Item
                            path={this.props.path}
                            item={item}
                            titleColumn={this.props.titleColumn}
                            grid={this.props.grid}
                            components={this.props.components}
                            isSelected={this.isItemSelected(item)}
                            selectionMode={true}
                            onClick={e => this.toggleItemSelection(item)}
                        />
                    </div>
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
                actions={[
                    (this.props.search ? <Search key={'search'} onSearch={keyword => this.search(keyword)} /> : null),
                    <FiltersTool path={this.props.path} filters={this.props.filters} key={'filters'} data={this.state.filterParams} onChange={params => this.filter(params)}/>
                ]}
                footer={[
                    <div className="item-picker-widget__footer" key={'footer'}>
                        <div className="item-picker-widget__footer-pagination">
                            {this.renderPagination()}
                        </div>
                        <div className="item-picker-widget__footer-actions">
                            <Button
                                key={'cancel'}
                                text={i18n.get('snippets.cancel')}
                                style={['secondary']}
                                onClick={this.onCancel.bind(this)}
                            />
                            <Button
                                key={'confirm'}
                                text={(this.props.selectionMode ? i18n.get('snippets.confirm_selection') : i18n.get('snippets.select_singular', {singular: this.props.singular}))}
                                style={this.state.selectedItemIds.length ? [] : ['disabled',]}
                                onClick={this.state.selectedItemIds.length ? this.onSelectionConfirm.bind(this) : null}
                            />
                        </div>
                    </div>
                ]}
            >
                <StickySidebar sidebar={this.renderSidebar()} key={'sidebar'}>
                    {this.state.items.length ? this.renderRows() : this.renderPlaceholder()}
                </StickySidebar>
            </Window>
        );
    }
}

export default ItemPickerWidget;
