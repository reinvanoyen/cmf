import React from 'react';
import components from "../rendering/components";
import Manager from "../core/messaging/manager";
import lang from "../state/lang";

class Translatable extends React.Component {

    static defaultProps = {
        id: null,
        components: [],
        path: {},
        data: {},
        languages: [],
        errors: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            language: this.getDefaultLanguage(),
            translatedComponents: this.translateComponentsForAllLanguages()
        };

        this.componentList = {};
        this.onLanguageSwitch = null;
    }

    getDefaultLanguage() {

        console.log(lang.get());

        if (this.props.languages.includes(lang.get())) {
            return lang.get();
        }
        return this.props.languages[0];
    }

    componentDidMount() {

        this.onLanguageSwitch = (event) => this.switchLanguage(event.language, false);

        Manager.on('language.switch', this.onLanguageSwitch);
    }

    componentWillUnmount() {
        Manager.off('language.switch', this.onLanguageSwitch);
    }

    componentDidUpdate(prevProps, prevState) {
        for (let i = 0; i < this.props.components.length; i++) {
            // We're checking if any of the components are changed
            if (
                ! prevProps.components[i] ||
                this.props.components[i].type !== prevProps.components[i].type ||
                this.props.components[i].name !== prevProps.components[i].name
            ) {
                // If so, translate them again!
                this.setState({
                    translatedComponents: this.translateComponentsForAllLanguages()
                });
                break;
            }
        }
    }

    handleSubmit(data) {
        this.props.languages.forEach(language => {
            this.componentList[language].forEach(obj => {
                obj.ref.current.handleSubmit(data);
            });
        });
    }

    getData(data) {
        this.props.languages.forEach(language => {
            this.componentList[language].forEach(obj => {
                obj.ref.current.getData(data);
            });
        });
        return data;
    }

    translateComponentsForAllLanguages() {
        let components = {};
        this.props.languages.forEach(language => {
            components[language] = this.translateComponents(language);
        });
        return components;
    }

    translateComponents(language) {
        return this.props.components.map(component => {

            // @TODO this is a dirty type check to make text-to-slug-field work inside of translatable components
            if (component.type === 'text-to-slug-field') {
                return {
                    ...component,
                    name: component.name+'_'+language,
                    slugName: component.slugName+'_'+language
                };
            }

            return {
                ...component,
                name: component.name+'_'+language
            };
        });
    }

    renderTranslatedComponents() {

        let rendered = [];

        for (let language in this.state.translatedComponents) {

            if (this.state.translatedComponents.hasOwnProperty(language)) {

                this.componentList[language] = components.renderComponentsWith(this.state.translatedComponents[language], this.props.data, this.props.path, (component, i) => {
                    return (
                        <div className="translatable__component" key={i}>
                            {component}
                        </div>
                    );
                }, true, this.props.errors);

                let componentListRenders = this.componentList[language].map(obj => obj.component);

                rendered.push(
                    <div className={'translatable__components'+(this.state.language === language ? ' translatable__components--active' : '')} key={language}>
                        {componentListRenders}
                    </div>
                );
            }
        }

        return rendered;
    }

    switchLanguage(language, master = true) {

        if (master) {
            // Set language on state
            lang.set(language);

            // Trigger event
            Manager.trigger('language.switch', {
                id: this.props.id,
                prevLanguage: this.state.language,
                language: language
            });
        }

        this.setState({
            language: language
        });
    }

    renderLanguageSwitcher() {
        return this.props.languages.map(language => {
            return (
                <button type="button" key={language} onClick={e => this.switchLanguage(language)} className={'translatable__button'+(language === this.state.language ? ' translatable__button--active' : '')}>
                    {language}
                </button>
            );
        });
    }

    render() {
        return (
            <div className="translatable" id={'language-'+this.props.id}>
                <div className="translatable__tabs">
                    {this.renderLanguageSwitcher()}
                </div>
                {this.renderTranslatedComponents()}
            </div>
        );
    }
}

export default Translatable;
