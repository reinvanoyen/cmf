import React from 'react';
import IconButton from "./icon-button";
import components from "../../rendering/components";
import Checkbox from "./checkbox";

class Item extends React.Component {

    static defaultProps = {
        path: {},
        item: {},
        titleColumn: '',
        isSelected: false,
        selectionMode: false,
        components: [],
        actions: [],
        grid: [],
        onClick: (e, item) => {}
    };

    renderActions() {
        if (! this.props.actions.length) {
            return null;
        }

        return (
            <div className="item__actions">
                {this.props.actions}
            </div>
        );
    }

    renderSelectionMode() {

        if (! this.props.selectionMode) {
            return null;
        }

        return (
            <div className="item__checkbox">
                <Checkbox checked={this.props.isSelected} />
            </div>
        );
    }

    getRowStyle() {

        let rowStyle = {
            gridTemplateColumns: 'repeat('+this.props.components.length+', 1fr)'
        };

        if (this.props.grid.length) {
            rowStyle.gridTemplateColumns = this.props.grid.join('fr ')+'fr';
        }

        return rowStyle;
    }

    renderItemContent() {
        if (this.props.components.length) {
            return (
                <div className="item__row" style={this.getRowStyle()}>
                    {this.props.components.map((component, i) => {
                        return (
                            <div className="item__component" key={i}>
                                {components.renderComponent(component, this.props.item, this.props.path)}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className="item__name">
                {this.props.item[this.props.titleColumn]}
            </div>
        );
    }

    render() {
        return (
            <div className={'item'+(this.props.isSelected ? ' item--selected' : '')} onClick={e => this.props.onClick(e, this.props.item)}>
                {this.renderSelectionMode()}
                <div className="item__content">
                    {this.renderItemContent()}
                </div>
                {this.renderActions()}
            </div>
        );
    }
}

export default Item;
