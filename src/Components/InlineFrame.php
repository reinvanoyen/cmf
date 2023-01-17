<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class InlineFrame extends Component
{
    private $load;

    /**
     * @return string
     */
    public function type(): string
    {
        return 'inline-frame';
    }

    /**
     * @param callable $load
     * @return $this
     */
    public function source(callable $load)
    {
        $this->load = $load;
        return $this;
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        if ($this->load) {
            $attributes[$this->getId().'_inline-frame'] = call_user_func($this->load, $model);
        }
    }
}
