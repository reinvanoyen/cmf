<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class Icon extends Component
{
    /**
     * @var $urlColumn
     */
    private $urlColumn;

    /**
     * @param string $name
     */
    public function __construct(string $name)
    {
        $this->export('name', $name);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'icon';
    }

    /**
     * @param string $actionPath
     * @return $this
     */
    public function to(string $actionPath)
    {
        $this->export('action', $actionPath);
        return $this;
    }

    /**
     * @param string $urlColumn
     * @return $this
     */
    public function toUrl(string $urlColumn)
    {
        $this->urlColumn = $urlColumn;
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
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        if ($this->urlColumn) {
            $attributes[$this->getId().'_to_url_icon'] = $model->{$this->urlColumn};
        }
    }
}
