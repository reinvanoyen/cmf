import React from 'react';
import IconButton from "./icon-button";
import Dropdown from "./dropdown";
import LinkList from "./link-list";

class Pagination extends React.Component {

    static defaultProps = {
        currentPage: 0,
        lastPage: 0,
        perPage: 0,
        total: 0,
        from: 0,
        to: 0,
        onPageChange: page => {}
    };

    changePage(page) {
        this.props.onPageChange(page);
    }

    render() {

        if (this.props.lastPage <= 1) {
            return null;
        }

        const prevActive = (this.props.currentPage > 1);
        const nextActive = (this.props.currentPage < this.props.lastPage);

        const prevBtn = [
            <IconButton key={'first'} name={'first_page'} style={(prevActive ? ['transparent'] : ['transparent', 'disabled'])} onClick={(prevActive ? (e) => this.changePage(1) : null)} />,
            <IconButton key={'prev'} name={'navigate_before'} style={(prevActive ? ['transparent'] : ['transparent', 'disabled'])} onClick={(prevActive ? (e) => this.changePage(this.props.currentPage - 1) : null)} />
        ];

        const nextBtn = [
            <IconButton key={'next'} name={'navigate_next'} style={(nextActive ? ['transparent'] : ['transparent', 'disabled'])} onClick={(nextActive ? (e) => this.changePage(this.props.currentPage + 1) : null)} />,
            <IconButton key={'last'} name={'last_page'} style={(nextActive ? ['transparent'] : ['transparent', 'disabled'])} onClick={(nextActive ? (e) => this.changePage(this.props.lastPage) : null)} />
        ];

        const links = Array(this.props.lastPage).fill().map((v, i) => {
            return [i+1, i+1];
        });

        return (
            <div className="pagination">
                <div className="pagination__prev">
                    {prevBtn}
                </div>
                <div className="pagination__status">
                    {this.props.from} to {this.props.to} of {this.props.total}
                    <Dropdown text={this.props.currentPage} style={['secondary']} autoClose={true}>
                        <LinkList stopPropagation={false} links={links} onClick={action => this.changePage(action)}/>
                    </Dropdown>
                </div>
                <div className="pagination__next">
                    {nextBtn}
                </div>
            </div>
        );
    }
}

export default Pagination;
