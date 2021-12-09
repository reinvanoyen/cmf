import React from 'react';
import components from "../rendering/components";

class Tabs extends React.Component {

    static defaultProps = {
        tabs: {},
        path: {},
        data: {},
        errors: {}
    };

    constructor(props) {
        super(props);

        this.componentLists = [];

        this.state = {
            currentTabIndex: 0
        };
    }

    handleSubmit(data) {
        this.componentLists.forEach(list => {
            list.forEach(obj => {
                obj.ref.current.handleSubmit(data);
            });
        });
    }

    getData(data) {
        this.componentLists.forEach(list => {
            list.forEach(obj => {
                obj.ref.current.getData(data);
            });
        });
        return data;
    }

    switchTab(index) {
        this.setState({
            currentTabIndex: index
        });
    }

    getTabsNav() {
        return this.props.tabs.map((tab, i) => {
            return (
                <div className={'tabs__nav-item'+(i === this.state.currentTabIndex ? ' tabs__nav-item--active' : '')} key={i} onClick={e => this.switchTab(i)}>
                    <div className="tabs__tab-title">
                        {tab.title}
                    </div>
                </div>
            );
        });
    }

    getTabsContent() {
        return this.props.tabs.map((tab, i) => {
            return (
                <div className="tabs__tab" key={i} style={{display: (i === this.state.currentTabIndex ? 'block' : 'none')}}>
                    {this.componentLists[i].map(obj => obj.component)}
                </div>
            );
        });
    }

    render() {

        this.componentLists = this.props.tabs.map((tab, i) => {
            return components.renderComponentsWith(tab.components, this.props.data, this.props.path, (component, i) => {
                return (
                    <div className="tabs__component" key={i}>
                        {component}
                    </div>
                );
            }, true, this.props.errors);
        });

        return (
            <div className="tabs">
                <div className="tabs__nav">
                    {this.getTabsNav()}
                </div>
                <div className="tabs__content">
                    {this.getTabsContent()}
                </div>
            </div>
        )
    }
}

export default Tabs;
