import React from 'react';
import Button from "./button";
import IconButton from "./icon-button";

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

        let prevBtn, nextBtn;

        if (this.props.currentPage > 1) {
            prevBtn = (
                <IconButton name={'arrow_left'} onClick={e => this.changePage(this.props.currentPage - 1)} />
            );
        }

        if (this.props.currentPage < this.props.lastPage) {
            nextBtn = (
                <IconButton name={'arrow_right'} onClick={e => this.changePage(this.props.currentPage + 1)} />
            );
        }

        return (
            <div className="pagination">
                <div className="pagination__status">
                    {this.props.from} - {this.props.to} of {this.props.total}
                </div>
                <div className="pagination__controls">
                    <div className="pagination__prev">
                        {prevBtn}
                    </div>
                    <div className="pagination__next">
                        {nextBtn}
                    </div>
                </div>
            </div>
        );
    }
}

export default Pagination;
