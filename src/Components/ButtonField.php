<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;
use ReinVanOyen\Cmf\Traits\HasTooltip;
use ReinVanOyen\Cmf\Traits\HasValidation;

class ButtonField extends Component
{
    use HasName;
    use HasValidation;
    use HasLabel;
    use HasTooltip;

    /**
     * @var string $urlColumnName
     */
    private $urlColumnName;

    /**
     * @param string $name
     * @param string $urlColumnName
     */
    public function __construct(string $name, string $urlColumnName)
    {
        $this->name($name);
        $this->urlColumnName = $urlColumnName;
        $this->export('urlColumnName', $this->urlColumnName);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'button-field';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = $model->{$this->getName()};
        $attributes[$this->urlColumnName] = $model->{$this->urlColumnName};
    }

    /**
     * @param Model $model
     * @param \Illuminate\Http\Request $request
     */
    public function save(Model $model, $request)
    {
        $model->{$this->getName()} = $request->input($this->getName());
        $model->{$this->urlColumnName} = $request->input($this->urlColumnName);
    }

    /**
     * @param array $validationRules
     * @return array
     */
    public function registerValidationRules(array $validationRules): array
    {
        if (in_array('required', $validationRules)) {
            $validationRules[$this->urlColumnName] = 'required';
        }

        return parent::registerValidationRules($validationRules);
    }
}
