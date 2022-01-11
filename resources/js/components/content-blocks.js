import React from 'react';
import Field from "../core/ui/field";
import Dropdown from "../core/ui/dropdown";
import LinkList from "../core/ui/link-list";
import components from "../rendering/components";
import Placeholder from "../core/ui/placeholder";
import util from "../core/ui/util";
import IconButton from "../core/ui/icon-button";

export default class ContentBlocks extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        singular: '',
        plural: '',
        tooltip: '',
        blocks: {},
        typeColumn: '',
        orderColumn: ''
    };

    constructor(props) {
        super(props);

        this.componentLists = [];

        this.state = {
            addedBlocks: [],
            blockIdsToRemove: []
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.fillContentBlocks();
        }
    }

    handleSubmit(data) {

        let payload = {
            blocks: [],
            remove: this.state.blockIdsToRemove
        };

        this.componentLists.forEach(componentListData => {

            let [componentList, id, type] = componentListData;

            let blockData = {};

            blockData.id = id;
            blockData[this.props.typeColumn] = type;

            componentList.forEach(obj => obj.ref.current.handleSubmit(blockData));

            payload.blocks.push(blockData);
        });

        data[this.props.name] = JSON.stringify(payload);
    }

    getBlockDefinition(type) {
        return this.props.blocks[type];
    }

    fillContentBlocks() {

        let items = this.props.data[this.props.name];

        let blockData = items.map((item, i) => {

            let type = item[this.props.typeColumn];
            let blockDefinition = this.getBlockDefinition(type);

            let block = {};

            block.id = item.id;
            block.name = blockDefinition.name;
            block.type = blockDefinition.type;
            block.components = blockDefinition.components;
            block.data = item;

            return block;
        });

        this.setState({
            addedBlocks: blockData
        });
    }

    handleOptionClick(link, index, id = null) {
        if (link === 'delete') {
            this.removeBlock(index, id);
        }
    }

    syncBlocksData() {

        let addedBlocks = this.state.addedBlocks;

        this.componentLists.forEach((componentListData, i) => {
            let [componentList, id, type] = componentListData;
            let data = addedBlocks[i].data;
            componentList.forEach(obj => {
                if (obj.ref.current.getData) {
                    addedBlocks.data = obj.ref.current.getData(data);
                }
            });
        });

        return addedBlocks;
    }

    sortUp(index) {

        if (index <= 0) return;

        let addedBlocks = this.syncBlocksData();
        let upIndex = index - 1;

        [addedBlocks[index], addedBlocks[upIndex]] = [addedBlocks[upIndex], addedBlocks[index]];

        this.setState({
            addedBlocks: addedBlocks
        });
    }

    sortDown(index) {

        if (index >= this.state.addedBlocks.length - 1) return;

        let addedBlocks = this.syncBlocksData();
        let downIndex = index + 1;

        [addedBlocks[index], addedBlocks[downIndex]] = [addedBlocks[downIndex], addedBlocks[index]];

        this.setState({
            addedBlocks: addedBlocks
        });
    }

    removeBlock(index, id = null) {

        util.confirm({
            title: 'Delete '+this.props.singular+'?',
            text: 'Are you sure you wish to delete this '+this.props.singular+'?',
            confirm: () => {

                let blockIdsToRemove = this.state.blockIdsToRemove;

                let addedBlocks = this.syncBlocksData();
                addedBlocks.splice(index, 1);

                if (id) {
                    blockIdsToRemove.push(id);
                }

                this.setState({
                    addedBlocks: addedBlocks,
                    blockIdsToRemove: blockIdsToRemove
                });
            }
        });
    }

    addBlock(type) {

        let blockDefinition = this.getBlockDefinition(type);

        let block = {};

        block.id = null;
        block.name = blockDefinition.name;
        block.type = blockDefinition.type;
        block.components = blockDefinition.components;
        block.data = {};

        let addedBlocks = this.state.addedBlocks;
        addedBlocks.push(block);

        this.setState({
            addedBlocks: addedBlocks
        });
    }

    renderAddBlockDropdown() {

        let links = [];

        for (let type in this.props.blocks) {
            if (this.props.blocks.hasOwnProperty(type)) {
                links.push([this.props.blocks[type].name, type]);
            }
        }

        return (
            <Dropdown text={'Add '+this.props.singular} openIcon={'post_add'} closeIcon={'post_add'}>
                <LinkList links={links} onClick={this.addBlock.bind(this)} />
            </Dropdown>
        );
    }

    renderContentBlocks() {

        this.componentLists = [];

        if (! this.state.addedBlocks.length) {
            return <Placeholder icon={'post_add'}>No {this.props.plural} added yet</Placeholder>;
        }

        return this.state.addedBlocks.map((blockData, i) => {

            let componentList = components.renderComponentsWith(blockData.components, blockData.data, this.props.path, (component, i) => {
                return (
                    <div className="content-block__component" key={i}>
                        {component}
                    </div>
                );
            }, true);

            this.componentLists.push([componentList, blockData.id, blockData.type]);

            return (
                <div key={i} className="content-blocks__item">
                    <div className={'content-block'}>
                        <div className="content-block__header">
                            {blockData.name}
                            <div className="content-block__actions">
                                <IconButton name={'arrow_upward'} onClick={e => this.sortUp(i)} />
                                <IconButton name={'arrow_downward'} onClick={e => this.sortDown(i)}/>
                                <Dropdown text={'More'} style={'small'}>
                                    <LinkList links={[
                                        ['Delete', 'delete']
                                    ]} onClick={link => this.handleOptionClick(link, i, blockData.id)} />
                                </Dropdown>
                            </div>
                        </div>
                        <div className="content-block__content">
                            {componentList.map(obj => obj.component)}
                        </div>
                    </div>
                </div>
            );
        });
    }

    render() {
        return (
            <Field
                name={this.props.name}
                label={this.props.label}
                tooltip={this.props.tooltip}
            >
                <div className={'content-blocks'}>
                    <div className={'content-blocks__content'}>
                        {this.renderContentBlocks()}
                    </div>
                    <div className={'content-blocks__footer'}>
                        {this.renderAddBlockDropdown()}
                    </div>
                </div>
            </Field>
        );
    }
}
