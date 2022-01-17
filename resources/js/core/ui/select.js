import React from 'react';
import SelectList from "./select-list";
import Search from "./search";
import object from "../../util/object";
import Icon from "./icon";

class Select extends React.Component {

    static defaultProps = {
        options: {},
        value: '',
        search: true,
        onChange: value => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            isSearching: false,
            searchResults: this.props.options,
            value: this.props.value || Object.keys(this.props.options)[0]
        };

        this.selectRef = React.createRef();
        this.handleDocumentClick = this.onDocumentClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({
                value: this.props.value
            });
        }
    }

    componentWillUnmount() {
        this.unbindDocumentClick();
    }

    bindDocumentClick() {
        document.addEventListener('click', this.handleDocumentClick);
    }

    unbindDocumentClick() {
        document.removeEventListener('click', this.handleDocumentClick);
    }

    onDocumentClick(e) {
        if (! this.selectRef.current.contains(e.target)) {
            this.close();
        }
    }

    toggle() {
        if (this.state.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.setState({
            isOpen: true
        });
        this.bindDocumentClick();
    }

    close() {
        this.setState({
            isOpen: false,
            searchResults: this.props.options
        });
        this.unbindDocumentClick();
    }

    search(keyword) {
        if (! keyword) {
            this.setState({
                isSearching: false,
                searchResults: this.props.options
            });
            return;
        }
        this.setState({
            isSearching: true,
            searchResults: object.filter(this.props.options, value => {
                return value.toLowerCase().startsWith(keyword.toLowerCase());
            })
        });
    }

    handleSelectionChange(values) {
        this.setState({
            isOpen: false,
            options: this.props.options,
            value: values[0]
        }, () => {
            this.props.onChange(this.state.value);
        });
    }

    renderDropdown() {

        if (this.state.isOpen) {

            let search;
            if (this.props.search && Object.keys(this.props.options).length > 5) {
                search = (
                    <div className="select__search">
                        <Search debounce={100} onSearch={keyword => this.search(keyword)}/>
                    </div>
                );
            }

            return (
                <div className="select__dropdown">
                    {search}
                    <div className="select__list">
                        <SelectList
                            multiple={false}
                            defaultValues={[this.state.value]}
                            options={this.state.isSearching ? this.state.searchResults : this.props.options}
                            onChange={values => this.handleSelectionChange(values)}
                        />
                    </div>
                </div>
            );
        }
        return null;
    }

    render() {
        return (
            <div className="select" ref={this.selectRef}>
                <div className="select__field" onClick={this.toggle.bind(this)}>
                    <div className="select__value">
                        {this.props.options[this.state.value]}
                    </div>
                    <div className="select__icon">
                        <Icon name={(this.state.isOpen ? 'expand_less' : 'expand_more')} />
                    </div>
                </div>
                {this.renderDropdown()}
            </div>
        );
    }
}

export default Select;
