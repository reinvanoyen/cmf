<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class Translatable extends Compound
{
    /**
     * @var array $languages
     */
    private $languages;

    /**
     * Translatable constructor.
     * @param array $languages
     * @param array $components
     */
    public function __construct(array $languages, array $components)
    {
        parent::__construct($components);

        $this->languages = $languages;
        $this->export('languages', $this->languages);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'translatable';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $childAttrs = [];

        foreach ($this->components as $component) {
            $component->provision($model, $childAttrs);
        }

        $fields = array_keys($childAttrs);

        foreach ($fields as $field) {
            foreach ($this->languages as $language) {
                $attributes[$field.'_'.$language] = $model->getTranslation($field, $language);
            }
        }
    }

    /**
     * @param Model $model
     * @param \Illuminate\Http\Request $request
     */
    public function save(Model $model, $request)
    {
        $childAttrs = [];

        foreach ($this->components as $component) {
            $component->provision(new ModelResource($model), $childAttrs);
        }

        $fields = array_keys($childAttrs);

        foreach ($this->languages as $language) {
            foreach ($fields as $field) {
                $model->setTranslation($field, $language, $request->input($field.'_'.$language));
            }
        }
    }

    /**
     * @param array $validationRules
     * @return array
     */
    public function registerValidationRules(array $validationRules): array
    {
        $translatableRules = [];

        foreach ($this->components as $component) {
            $translatableRules = array_merge($translatableRules, $component->registerValidationRules($translatableRules));
        }

        $translatedRules = [];
        foreach ($translatableRules as $field => $rules) {
            foreach ($this->languages as $language) {
                $translatedRules[$field.'_'.$language] = $rules;
            }
        }

        $validationRules = array_merge($validationRules, $translatedRules);

        return $validationRules;
    }
}
