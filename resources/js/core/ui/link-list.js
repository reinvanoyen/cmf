import React from 'react';
import helpers from "../../util/helpers";

class LinkList extends React.Component {

    static defaultProps = {
        links: [],
        style: 'default',
        onClick: actionPath => {}
    };

    onClick(e, actionPath) {
        e.stopPropagation();
        this.props.onClick(actionPath);
    }

    renderLinks() {
        return this.props.links.map((link, i) => {
            if (link !== null) {
                return (
                    <button className={'link-list__button'} onClick={e => this.onClick(e, link[1])} key={i} type={'button'}>
                        {link[0]}
                    </button>
                );
            }
        });
    }

    render() {
        return (
            <div className={helpers.className('link-list', this.props.style)}>
                {this.renderLinks()}
            </div>
        );
    }
}

export default LinkList;
