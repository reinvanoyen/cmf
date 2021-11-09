<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Action\Index;
use ReinVanOyen\Cmf\Filters\Filter;
use ReinVanOyen\Cmf\RelationshipMetaGuesser;

class HasMany extends ActionComponent
{
    /**
     * @var string $relationship
     */
    private $relationship;

    /**
     * @var string $meta
     */
    private $meta;

    /**
     * @var array $components
     */
    private $components;

    /**
     * @var Index $index
     */
    private $index;

    /**
     * @var array $header
     */
    private $header = [];

    /**
     * @var array $searchColumns
     */
    private $searchColumns = [];

    /**
     * @var array $filters
     */
    private $filters = [];

    /**
     * @var array $grid
     */
    private $grid = [];

    /**
     * @var string $action
     */
    private $action;

    /**
     * @var string $orderByColumn
     */
    private $orderByColumn;

    /**
     * @var string $orderByMethod
     */
    private $orderByMethod;

    /**
     * HasMany constructor.
     * @param string $relationship
     * @param array $components
     */
    public function __construct(string $relationship, array $components = [])
    {
        $this->relationship = $relationship;
        $this->components = $components;
    }

    /**
     * @param Action $action
     */
    public function resolve(Action $action)
    {
        $meta = ($this->meta ? $this->meta : RelationshipMetaGuesser::getMeta($this->relationship));
        $components = (count($this->components) ? $this->components : $meta::index());

        // Make a new index with the model of the action
        $this->index = Index::make($action->getMeta(), $components)
            ->relationship($this->relationship);

        // Copy some options from $meta

        $this->index
            ->singular($meta::getSingular())
            ->plural($meta::getPlural())
            ->paginate($meta::getPerPage());

        // Header
        if (count($this->header)) {
            $this->index->header($this->header);
        }

        // Search
        if (count($this->searchColumns)) {
            $this->index->search($this->searchColumns);
        }

        // Filters
        if (count($this->filters)) {
            foreach ($this->filters as $filter) {
                $this->index->filter($filter);
            }
        }

        // Action
        if ($this->action) {
            $this->index->action($this->action);
        }

        // Order by
        if ($this->orderByColumn) {
            $this->index->orderBy($this->orderByColumn, $this->orderByMethod);
        }

        // Grid
        if (count($this->grid)) {
            $this->index->grid($this->grid);
        }

        // Set the index as the child action
        $this->childAction($this->index);

        parent::resolve($action);
    }

    /**
     * @param string $meta
     * @return $this
     */
    public function meta(string $meta)
    {
        $this->meta = $meta;
        return $this;
    }

    /**
     * @param array $components
     * @return $this
     */
    public function header(array $components)
    {
        $this->header = $components;
        return $this;
    }

    /**
     * @param string $action
     * @return $this
     */
    public function action(string $action)
    {
        $this->action = $action;
        return $this;
    }

    /**
     * @param string $column
     * @param string $method
     * @return $this
     */
    public function orderBy(string $column, string $method = 'asc')
    {
        $this->orderByColumn = $column;
        $this->orderByMethod = $method;
        return $this;
    }

    /**
     * @param array $columns
     * @return $this
     */
    public function search(array $columns)
    {
        $this->searchColumns = $columns;
        return $this;
    }

    /**
     * @param Filter $filter
     * @return $this
     */
    public function filter(Filter $filter)
    {
        $this->filters[] = $filter;
        return $this;
    }

    /**
     * @param array $grid
     * @return $this
     */
    public function grid(array $grid)
    {
        $this->grid = $grid;
        return $this;
    }
}
