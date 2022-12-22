import React from 'react';
import Icon from "./icon";
import IconButton from "./icon-button";
import i18n from "../../util/i18n";

class Search extends React.Component {

    static defaultProps = {
        modifiers: ['negative'],
        placeholder: 'Type to search...',
        onSearch: keyword => {},
        debounce: 1000
    };

    constructor(props) {

        super(props);

        this.state = {
            value: ''
        };

        this.searchTimeout = null;
    }

    handleChange(event) {

        clearTimeout(this.searchTimeout);

        this.setState({
            value: event.target.value
        });

        this.searchTimeout = setTimeout(this.search.bind(this), this.props.debounce);
    }

    handleSubmit(e) {
        this.search();
        e.preventDefault();
    }

    search() {
        this.props.onSearch(this.state.value);
    }

    clear() {
        this.setState({
            value: ''
        }, () => {
            this.search();
        });
    }

    render() {
        return (
            <div className={'search'+(this.state.value ? ' search--searching' : '')}>
                <div className="search__icon">
                    <Icon name={'search'} />
                </div>
                <input
                    autoComplete={'off'}
                    className={'search__input'}
                    name="search"
                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                    placeholder={i18n.get('snippets.search')}
                />
                <div className="search__clear">
                    <IconButton
                        style={'transparent'}
                        iconStyle={'mini'}
                        name={'clear'}
                        onClick={this.clear.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default Search;
