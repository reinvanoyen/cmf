<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Support\Str;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;
use ReinVanOyen\Cmf\Traits\HasTooltip;
use ReinVanOyen\Cmf\Traits\HasValidation;

class EnumSwitchField extends Component
{
    use HasName;
    use HasValidation;
    use HasLabel;
    use HasTooltip;

    /**
     * @var array $options
     */
    private $options = [];

    /**
     * EnumField constructor.
     * @param string $name
     * @param array $options
     */
    public function __construct(string $name)
    {
        $this->name($name);
        $this->label(Str::labelify($name));
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'enum-switch-field';
    }

    /**
     * @param string $typeName
     * @param string $typeValue
     * @param array $components
     * @return $this
     */
    public function option(string $typeName, string $typeValue, array $components)
    {
        $this->options[$typeValue] = [
            'name' => $typeName,
            'type' => $typeValue,
            'components' => $components,
        ];

        $this->export('options', $this->options);
        return $this;
    }

    /**
     * @param Action $action
     */
    public function resolve(Action $action)
    {
        foreach ($this->options as $option) {
            foreach ($option['components'] as $component) {
                $component->resolve($action);
            }
        }

        parent::resolve($action);
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $value = $model->{$this->getName()} ?? array_keys($this->options)[0];
        $attributes[$this->getName()] = $value;

        $components = $this->options[$value]['components'];

        foreach ($components as $component) {
            $component->provision($model, $attributes);
        }
    }

    /**
     * @param Model $model
     * @param \Illuminate\Http\Request $request
     */
    public function save(Model $model, $request)
    {
        $value = $request->input($this->getName());
        $model->{$this->getName()} = $value;

        $components = $this->options[$value]['components'];

        foreach ($components as $component) {
            $component->save($model, $request);
        }
    }

    /**
     * @param array $validationRules
     * @return array
     */
    public function registerValidationRules(array $validationRules): array
    {
        foreach ($this->options as $option) {
            foreach ($option['components'] as $component) {
                $validationRules = array_merge($validationRules, $component->registerValidationRules($validationRules));
            }
        }

        /**
         * @TODO
         * The problem with this approach, is components with the same name will overwrite eachothers validation rules
         */

        return $validationRules;
    }
}
