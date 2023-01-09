<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class TimeField extends TextField
{
    /**
     * @return string
     */
    public function type(): string
    {
        return 'time-field';
    }

    /**
     * @param string $time
     * @return $this
     */
    public function min(string $time)
    {
        $this->export('min', $time);
        return $this;
    }

    /**
     * @param string $time
     * @return $this
     */
    public function max(string $time)
    {
        $this->export('max', $time);
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
}
