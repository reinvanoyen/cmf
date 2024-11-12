<?php

namespace ReinVanOyen\Cmf\Action;

use ReinVanOyen\Cmf\Components\Component;

class Index extends CollectionAction
{
    /**
     * @var string $model
     */
    protected $model;

    /**
     * Index constructor.
     *
     * @param string $meta
     * @param array $components
     * @throws \ReinVanOyen\Cmf\Exceptions\InvalidMetaException
     */
    public function __construct(string $meta, array $components = [])
    {
        $this->meta($meta);

        $this->singular($this->getMeta()::getSingular());
        $this->plural($this->getMeta()::getPlural());
        $this->paginate($this->getMeta()::getPerPage());
        $this->paginate($this->getMeta()::getPerPage());
        $this->grid($this->getMeta()::getIndexGrid());
        $this->sorter($this->getMeta()::sorter());

        $this->components(count($components) ? $components : $this->getMeta()::index());
        $this->model = $this->getMeta()::getModel();

        $searcher = $this->getMeta()::searcher();

        if ($searcher) {
            $this->searcher($searcher);
        }

        foreach ($this->getMeta()::filters() as $filter) {
            $this->filter($filter);
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

    /**
     * @param array $actions
     * @return $this
     */
    public function actions(array $actions)
    {
        $this->export('actions', $actions);
        return $this;
    }

    /**
     * @param array $actions
     * @return $this
     */
    public function bulkActions(array $actions)
    {
        $this->export('bulkActions', $actions);
        return $this;
    }
}
