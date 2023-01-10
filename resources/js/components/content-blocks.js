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
import Divider from "../core/ui/divider";
import i18n from "../util/i18n";
import str from "../util/str";

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

        util.notify(i18n.get('snippets.order_changed'));
    }

    sortDown(index) {

        if (index >= this.state.addedBlocks.length - 1) return;

        let addedBlocks = this.syncBlocksData();
        let downIndex = index + 1;

        [addedBlocks[index], addedBlocks[downIndex]] = [addedBlocks[downIndex], addedBlocks[index]];

        this.setState({
            addedBlocks: addedBlocks
        });

        util.notify(i18n.get('snippets.order_changed'));
    }

    removeBlock(index, id) {

        util.confirm({
            title: i18n.get('snippets.delete_singular_title', {singular: this.props.singular}),
            text: i18n.get('snippets.delete_singular_text', {singular: this.props.singular}),
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

                util.notify(i18n.get('snippets.singular_deleted', {singular: this.props.singular}));
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
            addedBlocks.splice(atIndex, 0, block);
            util.notify(i18n.get('snippets.singular_inserted', {singular: this.props.singular}));
        } else {
            addedBlocks.push(block);
            util.notify(i18n.get('snippets.singular_added', {singular: this.props.singular}));
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

        return (
            <Dropdown autoClose={true} text={text} openIcon={'post_add'} closeIcon={'post_add'} key={index}>
                <LinkList links={this.getTypeLinks()} onClick={type => this.addBlock(type, index)} />
            </Dropdown>
        );
    }

    optionDropdownClick(action, index, blockId) {
        if (action === 'delete') {
            this.removeBlock(index, blockId);
        }
    }

    getTypeLinks() {
        return Object.getOwnPropertyNames(this.props.blocks).map(type => {
            return [this.props.blocks[type].name, type];
        });
    }

    getTypeLinksInsertBelow() {
        return Object.getOwnPropertyNames(this.props.blocks).map(type => {
            return [i18n.get('snippets.insert_singular_below', {singular: this.props.blocks[type].name}), type];
        });
    }

    renderContentBlocks() {

        this.componentLists = [];

        if (! this.state.addedBlocks.length) {
            return (
                <Placeholder icon={'post_add'}>
                    {i18n.get('snippets.no_plural_added', {plural: this.props.plural})}
                </Placeholder>
            );
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

            return (
                <div className="content-blocks__item" key={i}>
                    <Collapsible title={blockData.name} actions={[
                        <IconButton key={0} style={['transparent', (i > 0 ? 'enabled' : 'disabled')]} iconStyle={'mini'} name={'arrow_upward'} onClick={e => this.sortUp(i)} />,
                        <IconButton key={1} style={['transparent', (i < this.state.addedBlocks.length - 1 ? 'enabled' : 'disabled')]} iconStyle={'mini'} name={'arrow_downward'} onClick={e => this.sortDown(i)}/>,
                        <Dropdown key={3} autoClose={true} openIcon={'more_horiz'} closeIcon={'more_horiz'}>
                            <LinkList links={this.getTypeLinksInsertBelow()} onClick={type => this.addBlock(type, (i+1))} />
                            <Divider />
                            <LinkList
                                style={'warning'}
                                links={[
                                    [str.toUpperCaseFirst(i18n.get('snippets.delete_singular', {singular: this.props.singular})), 'delete']
                                ]}
                                onClick={action => this.optionDropdownClick(action, i, blockData.id)}
                            />
                        </Dropdown>
                    ]}>
                        {componentList.map(obj => obj.component)}
                    </Collapsible>
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
                        {this.renderAddBlockDropdown(str.toUpperCaseFirst(i18n.get('snippets.add_singular', {singular: this.props.singular})))}
                    </div>
                </div>
            </Field>
        );
    }
}
