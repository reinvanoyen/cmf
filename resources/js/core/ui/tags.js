"use strict";

import React from 'react';

export default class Tags extends React.Component {

    static defaultProps = {
        tags: []
    };

    render() {
        return (
            <div className={'tags'}>
                {this.props.tags.map((tag, i) => {
                    return (
                        <div className="tags__tag" key={i}>{tag}</div>
                    );
                })}
            </div>
        );
    }
}
