<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;

class TextView extends Component
{
    use HasName;
    use HasLabel;

    /**
     * @return string
     */
    public function type(): string
    {
        return 'text-view';
    }

    /**
     * @param string $style
     * @return $this
     */
    public function style(string $style)
    {
        $this->export('style', $style);
        return $this;
    }

    /**
     * @return $this
     */
    public function url()
    {
        $this->export('url', true);
        return $this;
    }

    /**
     * @return $this
     */
    public function copyable()
    {
        $this->export('copyable', true);
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
}
