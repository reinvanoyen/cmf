import React from 'react';
import components from "../rendering/components";

class Translatable extends React.Component {

    static defaultProps = {
        components: [],
        path: {},
        data: {},
        languages: [],
        errors: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            language: this.props.languages[0],
            translatedComponents: this.translateComponentsForAllLanguages()
        };

        this.componentList = {};
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
                )
            }
        }

        return rendered;
    }

    switchLanguage(language) {
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
            <div className="translatable">
                <div className="translatable__tabs">
                    {this.renderLanguageSwitcher()}
                </div>
                {this.renderTranslatedComponents()}
            </div>
        );
    }
}

export default Translatable;
