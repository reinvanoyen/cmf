import React from 'react';
import parse from 'html-react-parser';

export default function RichTextView(props) {

    const {
        data = {},
        path = {},
        type = '',
        id = 0,
        name = '',
        label = ''
    } = props;

    const renderLabel = () => {
        if (label) {
            return (
                <label className="label belongs-to-view__label">
                    {label}
                </label>
            );
        }
        return null;
    };

    const render = () => {

        let value = (data[name] ? data[name] : '-');

        return (
            <div className="richtext-view">
                {renderLabel()}
                <span className={'richtext-view__value'}>
                    {parse(value)}
                </span>
            </div>
        );
    }

    return render();
}
