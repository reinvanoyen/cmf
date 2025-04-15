<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;

class BooleanStatusView extends Component
{
    use HasName;
    use HasLabel;

    public function __construct(string $name, string $trueStringLiteral, string $falseStringLiteral)
    {
        $this->name($name);
        $this->export('trueStringLiteral', $trueStringLiteral);
        $this->export('falseStringLiteral', $falseStringLiteral);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'boolean-status-view';
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
