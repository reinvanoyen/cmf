import React, {useState} from 'react';
import api from "../api/api";
import path from "../state/path";
import ui from "../core/ui/util";
import Button from "../core/ui/button";
import i18n from "../util/i18n";
import useOnMount from "../hooks/use-on-mount";
import components from "../rendering/components";
import clsx from "clsx";

function SelectOne(props) {

    const [state, setState] = useState({
        options: [],
        selectedOptionId: null,
    });

    useOnMount(() => {
        loadOptions();
    });

    const loadOptions = async () => {
        const response = await api.execute.get(props.path, props.id,'loadOptions', props.path.params);

        setState({
            ...state,
            options: response.data.data
        });
    };

    const execute = async () => {
        // Load the data from the backend (with id as param)
        await api.execute.get(props.path, props.id,'execute', {
            selectedId: state.selectedOptionId,
            ids: state.options.map(option => option.id),
        });
        // Redirect
        redirect();
        // Notify the user
        ui.notify(i18n.get('snippets.singular_deleted', {singular: props.singular}));
    }

    const redirect = () => {
        path.handleRedirect(props);
    }

    const selectOption = (option) => {
        setState({
            ...state,
            selectedOptionId: option.id,
        });
    };

    return (
        <div className="select-one">
            <div className="select-one__options">
                {state.options.map((option, index) => {
                    return (
                        <div className={clsx({
                            'select-one__option': true,
                            'select-one__option--selected': state.selectedOptionId === option.id
                        })} key={index} onClick={e => selectOption(option)}>
                            {props.components.map((component, i) => {
                                return (
                                    <div className="index-row__component" key={i}>
                                        {components.renderComponent(component, option, props.path)}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            <div className="select-one__footer">
                <div className="select-one__confirm">
                    <Button
                        onClick={execute}
                        text={i18n.get('snippets.delete_singular_confirm', {singular: props.singular})}
                    />
                </div>
                <div className="select-one__cancel">
                    <Button
                        onClick={redirect}
                        text={i18n.get('snippets.delete_singular_cancel')}
                        style={'secondary'}
                    />
                </div>
            </div>
        </div>
    );
}

SelectOne.defaultProps = {
    type: '',
    components: [],
    path: {},
    id: 0,
    data: {},
    params: null,
    redirect: 'index',
    redirectBack: false,
    singular: '',
    plural: ''
};

export default SelectOne;
