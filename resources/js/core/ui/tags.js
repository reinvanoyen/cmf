"use strict";

import React from 'react';

export default class Tags extends React.Component {

    static defaultProps = {
        tags: [],
        onClick: null
    };

    render() {
        return (
            <div className={'tags'}>
                {this.props.tags.map((tag, i) => {
                    return (
                        <div
                            className={'tags__tag'+(this.props.onClick ? ' tags__tag--clickable' : '')}
                            key={i}
                            onClick={this.props.onClick ? e => this.props.onClick(tag) : null}
                        >
                            {tag}
                        </div>
                    );
                })}
            </div>
        );
    }
}
