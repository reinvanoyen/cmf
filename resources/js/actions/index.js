import React from 'react';
import components from "../rendering/components";
import filters from "../rendering/filters";
import api from "../api/api";
import path from "../state/path";
import Loader from "../core/ui/loader";
import Pagination from "../core/ui/pagination";
import Search from "../core/ui/search";
import Link from "../core/ui/link";
import str from "../util/str";

class Index extends React.Component {

    static defaultProps = {
        type: '',
        components: [],
        path: {},
        id: 0,
        data: {},
        params: null,
        search: false,
        relationship: false,
        filters: [],
        sorter: null,
        restrictByFk: null,
        action: '',
        style: 'default',
        plural: '',
        singular: ''
    };

    constructor(props) {

        super(props);

        this.state = {
            isLoading: true,
            rows: [],
            meta: null,
            searchKeyword: null,
            filterParams: {},
            hasActiveFilters: false
        };

        this.filterList = [];
    }

    componentDidUpdate(prevProps) {
        if (this.props.restrictByFk || this.props.relationship) {
            if (this.props.data.id !== prevProps.data.id) {
                this.load();
            }
        }
    }

    componentDidMount() {
        if (! this.props.restrictByFk && ! this.props.relationship) {
            this.load();
        }
    }

    load(params = {}) {

        // Add FK to the params
        if (this.props.restrictByFk) {
            params.foreign = this.props.data.id;
        }

        // Add the current data id to the params because we need it to fetch the relationship
        if (this.props.relationship) {
            params.relation = this.props.data.id;
        }

        // Search for search keyword
        if (this.state.searchKeyword) {
            params.search = this.state.searchKeyword;
        }

        // If filter params are set, add them to the http params
        if (this.state.filterParams) {
            for (let filterId in this.state.filterParams) {
                if (this.state.filterParams.hasOwnProperty(filterId)) {
                    params['filter_'+filterId] = this.state.filterParams[filterId];
                }
            }
        }

        // Execute the get request
        api.execute.get(this.props.path, this.props.id,'load', params).then(response => {
            this.setState({
                isLoading: false,
                rows: response.data.data,
                meta: response.data.meta || null
            });
        });
    }

    onRowClick(row) {
        path.goTo(this.props.path.module, this.props.action, {
            id: row.id
        });
    }

    getRowStyle() {

        let rowStyle = {
            gridTemplateColumns: 'repeat('+this.props.components.length+', 1fr)'
        };

        if (this.props.grid) {
            rowStyle.gridTemplateColumns = this.props.grid.join('fr ')+'fr';
        }

        return rowStyle;
    }

    renderFilters() {

        this.filterList = filters.renderFiltersWith(this.props.filters, {}, this.props.path, (filter, i) => {
            return (
                <div className="index__header-filter" key={i}>
                    {filter}
                </div>
            );
        }, this.onFilterChange.bind(this), true);

        return this.filterList.map(obj => obj.filter);
    }

    renderFiltersTool() {

        if (this.props.filters.length) {

            return (
                <div className="index__header-filters-tool">
                    {this.renderFilters()}
                    <div className="index__header-clear-filters">
                        <Link onClick={this.state.hasActiveFilters ? this.clearFilters.bind(this) : null} text={'Clear filters'} style={this.state.hasActiveFilters ? '' : 'disabled'} />
                    </div>
                </div>
            );
        }

        return null;
    }

    renderHeader() {

        let indexSearch = (this.props.search ? <div className="index__header-search"><Search onSearch={keyword => this.search(keyword)}/></div> : null);

        return (
            <div className="index__header">
                <div className="index__header-title">
                    {str.toUpperCaseFirst(this.props.plural)} {this.state.meta ? '('+this.state.meta.total+')' : null}
                </div>
                <div className="index__header-options">
                    {indexSearch}
                    {this.renderFiltersTool()}
                </div>
            </div>
        );
    }

    renderFooter() {

        if (! this.state.meta || ! this.state.meta.total) {
            return null;
        }

        return (
            <div className="index__footer">
                <Pagination
                    currentPage={this.state.meta.current_page}
                    lastPage={this.state.meta.last_page}
                    perPage={this.state.meta.per_page}
                    total={this.state.meta.total}
                    from={this.state.meta.from}
                    to={this.state.meta.to}
                    onPageChange={this.changePage.bind(this)}
                />
            </div>
        );
    }

    renderPlaceholder() {

        if (this.state.searchKeyword) {
            return (
                <div className="index__placeholder">
                    No {this.props.plural} found for your search "{this.state.searchKeyword}".
                </div>
            );
        }

        return (
            <div className="index__placeholder">
                No {this.props.plural.toLowerCase()} found.
            </div>
        );
    }

    renderRows() {

        if (this.state.rows.length) {
            return (
                <div className="index__rows">
                    {this.state.rows.map(row => {
                        let rowContent = this.props.components.map((component, i) => {
                            return (
                                <div className="index__component" key={i}>
                                    {components.renderComponent(component, row, this.props.path)}
                                </div>
                            );
                        });

                        return (
                            <div className={'index__row'+(this.props.action ? ' index__row--clickable' : '')} key={row.id} style={this.getRowStyle()} onClick={this.props.action ? this.onRowClick.bind(this, row) : null}>
                                {rowContent}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return this.renderPlaceholder();
    }

    changePage(page) {
        this.load({
            page: page
        });
    }

    onFilterChange(filterId, filterValue) {

        if (filterValue) {
            this.state.filterParams[filterId] = filterValue;
        } else {
            delete this.state.filterParams[filterId];
        }

        this.setState({
            filterParams: this.state.filterParams,
            hasActiveFilters: (Object.keys(this.state.filterParams).length !== 0)
        }, () => {
            this.load();
        });
    }

    clearFilters() {
        this.filterList.forEach(obj => obj.ref.current.clear());
    }

    search(keyword) {
        this.setState({
            searchKeyword: keyword
        }, () => {

            this.load();
        });
    }

    render() {

        if (this.state.isLoading) {
            return <Loader />;
        }

        return (
            <div className={'index index--'+this.props.style}>
                {this.renderHeader()}
                {this.renderRows()}
                {this.renderFooter()}
            </div>
        );
    }
}

export default Index;
