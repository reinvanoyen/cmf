<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Support\Str;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;
use ReinVanOyen\Cmf\Traits\HasTooltip;
use ReinVanOyen\Cmf\Traits\HasValidation;

class TextField extends Component
{
    use HasName;
    use HasValidation;
    use HasLabel;
    use HasTooltip;

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
     * @return string
     */
    public function type(): string
    {
        return 'text-field';
    }

    /**
     * @param string $placeholderText
     * @return $this
     */
    public function placeholder(string $placeholderText)
    {
        $this->export('placeholder', $placeholderText);
        return $this;
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
     * @param mixed $style
     * @return $this
     */
    public function style($style)
    {
        $this->export('style', $style);
        return $this;
    }

    /**
     * @param string $value
     * @return $this
     */
    public function default(string $value)
    {
        $this->export('default', $value);
        return $this;
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
        $model->{$this->getName()} = $request->input($this->getName());
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
