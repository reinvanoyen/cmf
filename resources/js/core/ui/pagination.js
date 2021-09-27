import React from 'react';
import Link from "./link";

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
                <Link text="Previous" onClick={e => this.changePage(this.props.currentPage - 1)} />
            );
        }

        if (this.props.currentPage < this.props.lastPage) {
            nextBtn = (
                <Link text="Next" onClick={e => this.changePage(this.props.currentPage + 1)} />
            );
        }

        return (
            <div className="pagination">
                <div className="pagination__prev">
                    {prevBtn}
                </div>
                <div className="pagination__status">
                    {this.props.from} - {this.props.to} of {this.props.total}
                </div>
                <div className="pagination__next">
                    {nextBtn}
                </div>
            </div>
        );
    }
}

export default Pagination;
