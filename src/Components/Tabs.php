<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class Tabs extends Component
{
    /**
     * @var array $tabs
     */
    private $tabs = [];

    /**
     * @return string
     */
    public function type(): string
    {
        return 'tabs';
    }

    /**
     * @param string $title
     * @param array $components
     * @return $this
     */
    public function tab(string $title, array $components = [])
    {
        $this->tabs[] = [
            'title' => $title,
            'components' => $components,
        ];
        $this->export('tabs', $this->tabs);
        return $this;
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        foreach ($this->tabs as $tab) {
            foreach ($tab['components'] as $component) {
                $component->provision($model, $attributes);
            }
        }
    }

    /**
     * @param Model $model
     * @param Request $request
     * @return mixed|void
     */
    public function save(Model $model, Request $request)
    {
        foreach ($this->tabs as $tab) {
            foreach ($tab['components'] as $component) {
                $component->save($model, $request);
            }
        }
    }

    /**
     * @param array $validationRules
     * @return array
     */
    public function registerValidationRules(array $validationRules): array
    {
        foreach ($this->tabs as $tab) {
            foreach ($tab['components'] as $component) {
                $validationRules = array_merge($validationRules, $component->registerValidationRules($validationRules));
            }
        }

        return $validationRules;
    }
}
