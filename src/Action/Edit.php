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
     * Edit constructor.
     * @param string $meta
     * @param array $components
     */
    public function __construct(string $meta, array $components = [])
    {
        $this->meta($meta);
        $this->singular($meta::getSingular());
        $this->plural($meta::getPlural());
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
     * @return array|mixed
     */
    public function apiLoad(Request $request)
    {
        $modelClass = $this->getMeta()::getModel();

        ModelResource::provision($this->components);

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

        $validationRules['id'] = 'required|integer';

        $request->validate($validationRules);

        // Save
        $model = $modelClass::findOrFail($request->input('id'));

        foreach ($this->components as $component) {
            $component->save($model, $request);
        }

        $model->save();

        ModelResource::provision($this->components);

        return new ModelResource($model);
    }
}
