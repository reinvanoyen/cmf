"use strict";

import './index.scss';

import React from 'react';
import i18n from '../../../util/i18n';

export default class Breadcrumbs extends React.Component {

    static defaultProps = {
        rootText: i18n.get('snippets.files_root'),
        items: [],
        onClick: item => {}
    };

    onClick(item) {
        this.props.onClick(item);
    }

    render() {
        return (
            <div className="breadcrumbs">
                <ul className={'breadcrumbs__list'}>
                    <li onClick={e => this.onClick(null)}>
                        <span>
                            {this.props.rootText}
                        </span>
                    </li>
                    {this.props.items.map((item, i) => {
                        return (
                            <li key={i}>
                                <span onClick={e => this.onClick(item)}>
                                    {item.name}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}
