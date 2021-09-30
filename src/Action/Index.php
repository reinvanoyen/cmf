<?php

namespace ReinVanOyen\Cmf\Action;

class Index extends CollectionAction
{
    /**
     * @var string $model
     */
    protected $model;

    /**
     * Index constructor.
     * @param string $meta
     * @param array $components
     */
    public function __construct(string $meta, array $components)
    {
        $this->meta($meta);
        $this->singular($meta::getSingular());
        $this->plural($meta::getPlural());
        $this->paginate($meta::getPerPage());
        $this->components($components);

        $this->model = $meta::getModel();
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'index';
    }

    /**
     * @param array $grid
     * @return $this
     */
    public function grid(array $grid)
    {
        $this->export('grid', $grid);
        return $this;
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
     * @param string $actionPath
     * @return $this
     */
    public function action(string $actionPath)
    {
        $this->export('action', $actionPath);
        return $this;
    }
}
