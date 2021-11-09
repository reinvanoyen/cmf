import React from 'react';

class LinkList extends React.Component {

    static defaultProps = {
        links: [],
        onClick: actionPath => {}
    };

    onClick(e, actionPath) {
        e.stopPropagation();
        this.props.onClick(actionPath);
    }

    renderLinks() {
        return this.props.links.map((link, i) => {
            return (
                <button className={'link-list__button'} onClick={e => this.onClick(e, link[1])} key={i}>
                    {link[0]}
                </button>
            );
        });
    }

    render() {
        return (
            <div className={'link-list'}>
                {this.renderLinks()}
            </div>
        );
    }
}

export default LinkList;
