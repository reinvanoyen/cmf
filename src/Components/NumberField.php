<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class NumberField extends TextField
{
    /**
     * @return string
     */
    public function type(): string
    {
        return 'number-field';
    }

    /**
     * @param float $number
     * @return $this
     */
    public function step(float $number)
    {
        $this->export('step', $number);
        return $this;
    }

    /**
     * @param float $number
     * @return $this
     */
    public function min(float $number)
    {
        $this->export('min', $number);
        return $this;
    }

    /**
     * @param float $number
     * @return $this
     */
    public function max(float $number)
    {
        $this->export('max', $number);
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
        $value = $request->input($this->getName());
        $value = ($value === 'null' ? null : $value);

        $model->{$this->getName()} = $value;
    }
}
