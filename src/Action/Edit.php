<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\CanRedirect;
use ReinVanOyen\Cmf\Traits\HasSingularPlural;

class Edit extends Action
{
    use CanRedirect;
    use HasSingularPlural;

    /**
     * @var array $sidebar
     */
    private array $sidebar = [];

    /**
     * Edit constructor.
     * @param string $meta
     * @param array $components
     */
    public function __construct(string $meta, array $components = [])
    {
        $this->meta($meta);
        $this->singular($meta::getSingular());
        $this->plural($meta::getPlural());
        $this->sidebar($meta::sidebar());
        $this->components(count($components) ? $components : $meta::edit());
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'edit';
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
     * @return array|mixed
     */
    public function apiLoad(Request $request)
    {
        $modelClass = $this->getMeta()::getModel();
        $components = (empty($this->sidebar) ? $this->components : array_merge($this->components, $this->sidebar));
        ModelResource::provision($components);

        return new ModelResource($modelClass::findOrFail($request->get('id')));
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

        $validationRules['id'] = 'required|integer';

        $request->validate($validationRules);

        // Save
        $model = $modelClass::findOrFail($request->input('id'));

        foreach ($this->components as $component) {
            $component->save($model, $request);
        }

        foreach ($this->sidebar as $component) {
            $component->save($model, $request);
        }

        $model->save();

        $components = (empty($this->sidebar) ? $this->components : array_merge($this->components, $this->sidebar));
        ModelResource::provision($components);

        return new ModelResource($model);
    }
}
