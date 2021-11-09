"use strict";

import React from 'react';

export default class DefinitionList extends React.Component {

    static defaultProps = {
        data: []
    };

    render() {
        return (
            <div className="definition-list">
                {this.props.data.map((item, i) => {
                    return (
                        <div className={'definition-list__item'} key={i}>
                            <span className={'definition-list__key'}>{item[0]}</span>
                            <span className={'definition-list__value'}>{item[1]}</span>
                        </div>
                    )
                })}
            </div>
        );
    }
}
