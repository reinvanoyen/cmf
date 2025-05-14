import React from 'react';

function BelongsToView(props) {

    const {
        data = {},
        label = '',
        name = '',
        style = 'default'
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

        if (data && typeof data[name] !== 'undefined') {
            return (
                <div className={`belongs-to-view belongs-to-view--${style}`}>
                    {renderLabel()}
                    <span className={'belongs-to-view__value'}>
                        {data[name]}
                    </span>
                </div>
            );
        }

        return null;
    };

    return render();
}

export default BelongsToView;
