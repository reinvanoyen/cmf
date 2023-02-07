<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Http\Resources\MediaFileResource;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class Card extends Compound
{
    /**
     * @var string $titleField
     */
    private $titleField;

    /**
     * @var string $subtitleField
     */
    private $subtitleField;

    /**
     * @var string $labelField
     */
    private $labelField;

    /**
     * @var string $photoName
     */
    private $photoName;

    /**
     * @var BooleanView $booleanView
     */
    private $booleanView;

    /**
     * @var array $footerComponents
     */
    private $footerComponents = [];

    /**
     * @return string
     */
    public function type(): string
    {
        return 'card';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        parent::provision($model, $attributes);

        foreach ($this->footerComponents as $component) {
            $component->provision($model, $attributes);
        }

        if ($this->titleField) {
            $attributes[$this->titleField] = $model->{$this->titleField};
        }

        if ($this->subtitleField) {
            $attributes[$this->subtitleField] = $model->{$this->subtitleField};
        }

        if ($this->labelField) {
            $attributes[$this->labelField] = $model->{$this->labelField};
        }

        if ($this->photoName) {
            $attributes[$this->photoName] = new MediaFileResource($model->{$this->photoName});
        }

        if ($this->booleanView) {
            $this->booleanView->provision($model, $attributes);
        }
    }

    public function footer(array $components)
    {
        $this->footerComponents = $components;
        $this->export('footer', $components);
        return $this;
    }

    /**
     * @param string $booleanColumn
     * @return $this
     */
    public function boolean(string $booleanColumn)
    {
        $this->booleanView = BooleanView::make($booleanColumn);
        $this->export('booleanView', $this->booleanView);
        return $this;
    }

    /**
     * @param string $titleField
     * @return $this
     */
    public function title(string $titleField)
    {
        $this->titleField = $titleField;
        $this->export('titleField', $this->titleField);
        return $this;
    }

    /**
     * @param string $subtitleField
     * @return $this
     */
    public function subtitle(string $subtitleField)
    {
        $this->subtitleField = $subtitleField;
        $this->export('subtitleField', $this->subtitleField);
        return $this;
    }

    /**
     * @param string $labelField
     * @return $this
     */
    public function label(string $labelField)
    {
        $this->labelField = $labelField;
        $this->export('labelField', $this->labelField);
        return $this;
    }

    /**
     * @param string $photoName
     * @return $this
     */
    public function photo(string $photoName)
    {
        $this->photoName = $photoName;
        $this->export('photo', $this->photoName);
        return $this;
    }

    /**
     * @param Action $action
     * @return void
     */
    public function resolve(Action $action)
    {
        foreach ($this->footerComponents as $component) {
            $component->resolve($action);
        }
        parent::resolve($action);
    }

    /**
     * @param array $validationRules
     * @return array
     */
    public function registerValidationRules(array $validationRules): array
    {
        foreach ($this->footerComponents as $component) {
            $validationRules = array_merge($validationRules, $component->registerValidationRules($validationRules));
        }

        return parent::registerValidationRules($validationRules);
    }

    /**
     * @param Model $model
     * @param $request
     * @return void
     */
    public function save(Model $model, $request)
    {
        foreach ($this->footerComponents as $component) {
            $component->save($model, $request);
        }

        parent::save($model, $request);
    }
}
