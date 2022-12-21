<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\CanRedirect;
use ReinVanOyen\Cmf\Traits\HasSingularPlural;

/**
 * Class CreateWizard
 * @package ReinVanOyen\Cmf\Action
 */
class CreateWizard extends Action
{
    use CanRedirect;
    use HasSingularPlural;

    /**
     * @var array $steps
     */
    private $steps;

    /**
     * @var string $restrictByFk
     */
    private $restrictByFk;

    /**
     * Create constructor.
     * @param string $meta
     */
    public function __construct(string $meta)
    {
        $this->meta($meta);
        $this->singular($meta::getSingular());
        $this->plural($meta::getPlural());
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
     * @param string $title
     * @param array $components
     * @return $this
     */
    public function step(string $title, array $components = [])
    {
        $this->steps[] = [
            'title' => $title,
            'components' => $components,
        ];
        $this->export('steps', $this->steps);
        return $this;
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'create-wizard';
    }

    /**
     * @param Request $request
     * @return array|mixed
     */
    public function apiSave(Request $request)
    {
        $modelClass = $this->getMeta()::getModel();

        $components = [];

        // Validate
        $validationRules = [];
        foreach ($this->steps as $step) {
            foreach ($step['components'] as $component) {
                $components[] = $component;
                $validationRules = array_merge($validationRules, $component->registerValidationRules($validationRules));
            }
        }

        $request->validate($validationRules);

        // Save
        $model = new $modelClass();

        foreach ($this->steps as $step) {
            foreach ($step['components'] as $component) {
                $component->save($model, $request);
            }
        }

        if ($this->restrictByFk) {
            $model->{$this->restrictByFk} = $request->input($this->restrictByFk);
        }

        $model->save();

        ModelResource::provision($components);

        return new ModelResource($model);
    }
}
