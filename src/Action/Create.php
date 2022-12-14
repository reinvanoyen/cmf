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
     * @var array $sidebar
     */
    private array $sidebar = [];

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
        $this->sidebar($meta::sidebar());
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
     * @param array $components
     * @return $this
     */
    public function sidebar(array $components)
    {
        $this->sidebar = $components;
        $this->export('sidebar', $this->sidebar);
        return $this;
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
        foreach ($this->sidebar as $component) {
            $validationRules = array_merge($validationRules, $component->registerValidationRules($validationRules));
        }

        $request->validate($validationRules);

        // Create a new item
        $model = new $modelClass();

        // Save every component to the model
        foreach ($this->components as $component) {
            $component->save($model, $request);
        }
        foreach ($this->sidebar as $component) {
            $component->save($model, $request);
        }

        if ($this->restrictByFk) {
            $model->{$this->restrictByFk} = $request->input($this->restrictByFk);
        }

        if ($this->attachToRelation) {
            $model->{$this->attachToRelation}()->associate($request->input($this->attachToRelation));
        }

        $model->save();

        $components = (empty($this->sidebar) ? $this->components : array_merge($this->components, $this->sidebar));
        ModelResource::provision($components);

        return new ModelResource($model);
    }
}
