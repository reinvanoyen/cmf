<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Support\Str;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;
use ReinVanOyen\Cmf\Traits\HasValidation;

class TextField extends Component
{
    use HasName;
    use HasValidation;
    use HasLabel;

    /**
     * TextField constructor.
     * @param string $name
     */
    public function __construct(string $name)
    {
        $this->name($name);
        $this->export('multiline', false);

        $this->label(Str::labelify($name));
    }

    /**
     * @return $this
     */
    public function multiline()
    {
        $this->export('multiline', true);
        return $this;
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'text-field';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = $model->{$this->getName()};
    }

    /**
     * @param Model $model
     * @param \Illuminate\Http\Request $request
     */
    public function save(Model $model, $request)
    {
        $model->{$this->getName()} = $request->input($this->name);
    }

    /**
     * @param array $validationRules
     * @return array
     */
    public function registerValidationRules(array $validationRules): array
    {
        $validationRules[$this->getName()] = $this->validationRules;

        return $validationRules;
    }
}
