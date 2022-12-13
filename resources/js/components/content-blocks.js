import React from 'react';
import Field from "../core/ui/field";
import Dropdown from "../core/ui/dropdown";
import LinkList from "../core/ui/link-list";
import components from "../rendering/components";
import Placeholder from "../core/ui/placeholder";
import util from "../core/ui/util";
import IconButton from "../core/ui/icon-button";
import Button from '../core/ui/button';
import Collapsible from "../core/ui/collapsible";

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
            addedBlocks: this.getAddedBlocks(),
            blocksToRemoveById: [],
            blocksToRemoveByOrder: []
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.data[this.props.name] !== prevProps.data[this.props.name]
        ) {
            this.setState({
                addedBlocks: this.getAddedBlocks()
            });
        }
    }

    getData(data) {
        // @TODO
        return data;
    }

    handleSubmit(data) {

        let payload = {
            update: [],
            removeById: this.state.blocksToRemoveById,
            removeByOrder: this.state.blocksToRemoveByOrder
        };

        this.componentLists.forEach((componentListData, index) => {

            let [componentList, id, type] = componentListData;

            let blockData = { id };
            blockData[this.props.typeColumn] = type;
            blockData[this.props.orderColumn] = index;

            componentList.forEach(obj => obj.ref.current.handleSubmit(blockData));

            payload.update.push(blockData);
        });

        data[this.props.name] = JSON.stringify(payload);

        this.setState({
            blocksToRemoveById: [],
            blocksToRemoveByOrder: []
        });
    }

    getBlockDefinition(type) {
        return this.props.blocks[type];
    }

    getAddedBlocks() {

        let items = this.props.data[this.props.name] || [];

        return items.map((item, i) => {

            let type = item[this.props.typeColumn];
            let blockDefinition = this.getBlockDefinition(type);

            if (! blockDefinition) {
                return null;
            }

            return {
                id: item.id,
                data: item,
                name: blockDefinition.name,
                type: blockDefinition.type,
                components: blockDefinition.components
            };
        });
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

        util.notify('Order successfully changed');
    }

    sortDown(index) {

        if (index >= this.state.addedBlocks.length - 1) return;

        let addedBlocks = this.syncBlocksData();
        let downIndex = index + 1;

        [addedBlocks[index], addedBlocks[downIndex]] = [addedBlocks[downIndex], addedBlocks[index]];

        this.setState({
            addedBlocks: addedBlocks
        });

        util.notify('Order successfully changed');
    }

    removeBlock(index, id) {

        util.confirm({
            title: 'Delete '+this.props.singular+'?',
            text: 'Are you sure you wish to delete this '+this.props.singular+'?',
            confirm: () => {

                let blocksToRemoveById = this.state.blocksToRemoveById;
                let blocksToRemoveByOrder = this.state.blocksToRemoveByOrder;
                let addedBlocks = this.syncBlocksData();
                addedBlocks.splice(index, 1);

                if (id) {
                    blocksToRemoveById.push(id);
                } else {
                    blocksToRemoveByOrder.push(index);
                }

                this.setState({
                    addedBlocks,
                    blocksToRemoveById,
                    blocksToRemoveByOrder
                });

                util.notify(this.props.singular+' successfully removed');
            }
        });
    }

    addBlock(type, atIndex = null) {

        let blockDefinition = this.getBlockDefinition(type);
        let addedBlocks = this.state.addedBlocks;

        let block = {
            id: null,
            name: blockDefinition.name,
            type: blockDefinition.type,
            components: blockDefinition.components,
            data: {}
        };

        if (atIndex !== null) {
            console.log(atIndex);
            addedBlocks.splice(atIndex, 0, block);
            util.notify(this.props.singular+' inserted');
        } else {
            addedBlocks.push(block);
            util.notify(this.props.singular+' added');
        }

        this.setState({ addedBlocks });
    }

    renderAddBlockDropdown(text, index = null) {

        let types = Object.getOwnPropertyNames(this.props.blocks);

        if (!types.length) {
            return null;
        }

        if (types.length === 1) {
            if (text) {
                return (
                    <Button
                        onClick={e => this.addBlock(types[0], index)}
                        icon={'add'}
                        style={['small', 'secondary']}
                        text={text}
                    />
                );
            }
            return (
                <IconButton
                    name={'post_add'}
                    iconStyle={'small'}
                    onClick={e => this.addBlock(types[0], index)}
                />
            );
        }

        let links = [];

        types.forEach(type => {
            if (this.props.blocks.hasOwnProperty(type)) {
                links.push([this.props.blocks[type].name, type]);
            }
        });

        return (
            <Dropdown autoClose={true} text={text} openIcon={'post_add'} closeIcon={'post_add'} key={index}>
                <LinkList links={links} onClick={type => this.addBlock(type, index)} />
            </Dropdown>
        );
    }

    renderContentBlocks() {

        this.componentLists = [];

        if (! this.state.addedBlocks.length) {
            return <Placeholder icon={'post_add'}>No {this.props.plural} added yet</Placeholder>;
        }

        return this.state.addedBlocks.map((blockData, i) => {

            if (! blockData) {
                return null;
            }

            let componentList = components.renderComponentsWith(blockData.components, blockData.data, this.props.path, (component, i) => {
                return (
                    <div className="content-blocks__component" key={i}>
                        {component}
                    </div>
                );
            }, true);

            this.componentLists.push([componentList, blockData.id, blockData.type]);

            let inlineAddBlock = null;

            if (this.state.addedBlocks.length > 1 && i < this.state.addedBlocks.length - 1) {
                inlineAddBlock = (
                    <div className="content-blocks__inline-add">
                        <div className="content-blocks__inline-add-knob">
                            {this.renderAddBlockDropdown(null, (i + 1))}
                        </div>
                    </div>
                );
            }

            return (
                <div className="content-blocks__item" key={i}>
                    <Collapsible title={blockData.name} actions={[
                        <IconButton key={0} style={['transparent', (i > 0 ? 'enabled' : 'disabled')]} iconStyle={'mini'} name={'arrow_upward'} onClick={e => this.sortUp(i)} />,
                        <IconButton key={1} style={['transparent', (i < this.state.addedBlocks.length - 1 ? 'enabled' : 'disabled')]} iconStyle={'mini'} name={'arrow_downward'} onClick={e => this.sortDown(i)}/>,
                        <IconButton key={2} style={'transparent'} iconStyle={'mini'} name={'delete'} onClick={e => this.removeBlock(i, blockData.id)} />
                    ]}>
                        {componentList.map(obj => obj.component)}
                    </Collapsible>
                    {inlineAddBlock}
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
                        {this.renderAddBlockDropdown('Add '+this.props.singular)}
                    </div>
                </div>
            </Field>
        );
    }
}
