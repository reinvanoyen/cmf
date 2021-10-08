<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\CanRedirect;
use ReinVanOyen\Cmf\Traits\HasSingularPlural;

class Create extends Action
{
    use CanRedirect;
    use HasSingularPlural;

    /**
     * @var int $restrictByFk
     */
    private $restrictByFk;

    /**
     * @var string $attachToRelation
     */
    private $attachToRelation;

    /**
     * Create constructor.
     * @param string $meta
     * @param array $components
     */
    public function __construct(string $meta, array $components = [])
    {
        $this->meta($meta);
        $this->singular($meta::getSingular());
        $this->plural($meta::getPlural());
        $this->components(count($components) ? $components : $meta::create());
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'create';
    }

    /**
     * @param string $column
     * @return $this
     */
    public function restrictByForeignKey(string $column)
    {
        $this->restrictByFk = $column;
        $this->export('restrictByFk', $column);
        return $this;
    }

    /**
     * @param string $attachToRelation
     * @return $this
     */
    public function attachTo(string $attachToRelation)
    {
        $this->attachToRelation = $attachToRelation;
        $this->export('attachToRelation', $this->attachToRelation);
        return $this;
    }

    /**
     * @param Request $request
     * @return array|mixed
     */
    public function apiSave(Request $request)
    {
        $modelClass = $this->getMeta()::getModel();

        // Validate
        $validationRules = [];
        foreach ($this->components as $component) {
            $validationRules = array_merge($validationRules, $component->registerValidationRules($validationRules));
        }

        $request->validate($validationRules);

        // Create a new item
        $model = new $modelClass();

        // Save every component to the model
        foreach ($this->components as $component) {
            $component->save($model, $request);
        }

        if ($this->restrictByFk) {
            $model->{$this->restrictByFk} = $request->input($this->restrictByFk);
        }

        if ($this->attachToRelation) {
            $model->{$this->attachToRelation}()->associate($request->input($this->attachToRelation));
        }

        $model->save();

        ModelResource::provision($this->components);

        return new ModelResource($model);
    }
}
