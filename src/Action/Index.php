<?php

namespace ReinVanOyen\Cmf\Action;

class Index extends CollectionAction
{
    /**
     * Index constructor.
     * @param string $model
     * @param array $components
     */
    public function __construct(string $model, array $components)
    {
        parent::__construct($model);

        $this->components = $components;
        $this->export('components', $this->components);

        $this->paginate(10);
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
