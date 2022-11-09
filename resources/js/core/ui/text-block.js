"use strict";

import React from 'react';
import Title from "./title";

export default class TextBlock extends React.Component {

    static defaultProps = {
        title: null,
        text: null
    };

    render() {
        return (
            <div className={'text-block'}>
                <Title>{this.props.title}</Title>
                <div>
                    {this.props.text}
                </div>
            </div>
        );
    }
}
