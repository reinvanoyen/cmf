<?php

namespace ReinVanOyen\Cmf\Action;

use ReinVanOyen\Cmf\Components\Component;
use ReinVanOyen\Cmf\Sorters\StaticSorter;

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
    public function __construct(string $meta, array $components = [])
    {
        $this->meta($meta);
        $this->singular($meta::getSingular());
        $this->plural($meta::getPlural());
        $this->paginate($meta::getPerPage());
        $this->components(count($components) ? $components : $meta::index());
        $this->model = $meta::getModel();

        if (count($meta::getSearchColumns())) {
            $this->search($meta::getSearchColumns());
        }

        if ($this->meta::getSorting()) {
            $this->sorter(StaticSorter::make($this->meta::getSorting()));
        }
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'index';
    }

    /**
     * @param Component $component
     * @return $this
     */
    public function prepend(Component $component)
    {
        $component->resolve($this);

        array_unshift($this->components, $component);
        $this->export('components', $this->components);
        return $this;
    }

    /**
     * @param Component $component
     * @return $this
     */
    public function append(Component $component)
    {
        $component->resolve($this);

        $this->components[] = $component;
        $this->export('components', $this->components);
        return $this;
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
