<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;

class DateTimeView extends TextView
{
    use HasName;
    use HasLabel;

    /**
     * @var string $format
     */
    private $format;

    /**
     * @return string
     */
    public function type(): string
    {
        return 'date-time-view';
    }

    /**
     * DateTimeField constructor.
     * @param string $name
     */
    public function __construct(string $name)
    {
        parent::__construct($name);

        $this->format('j M Y H:i');
    }

    /**
     * @param string $format
     * @return $this
     */
    public function format(string $format)
    {
        $this->format = $format;

        return $this;
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = $model->{$this->getName()}->format($this->format);
    }
}
