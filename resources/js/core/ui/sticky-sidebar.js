import React from 'react';

class StickySidebar extends React.Component {
    render() {
        return (
            <div className={'sticky-sidebar'}>
                <div className="sticky-sidebar__content">
                    {this.props.children}
                </div>
                <div className="sticky-sidebar__side">
                    {this.props.sidebar}
                </div>
            </div>
        );
    }
}

export default StickySidebar;
