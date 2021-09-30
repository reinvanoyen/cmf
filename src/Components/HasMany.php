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
     * HasMany constructor.
     * @param string $relationship
     * @param array $components
     */
    public function __construct(string $relationship, array $components)
    {
        $this->relationship = $relationship;
        $this->components = $components;
    }

    /**
     * @param Action $action
     */
    public function resolve(Action $action)
    {
        // Make a new index with the model of the action
        $this->index = Index::make($action->getMeta(), $this->components)
            ->relationship($this->relationship);

        $meta = RelationshipMetaGuesser::getMeta($this->relationship);

        $this->index
            ->singular($meta::getSingular())
            ->plural($meta::getPlural())
            ->paginate($meta::getPerPage());

        if (count($this->header)) {
            $this->index->header($this->header);
        }

        if (count($this->searchColumns)) {
            $this->index->search($this->searchColumns);
        }

        if (count($this->filters)) {
            foreach ($this->filters as $filter) {
                $this->index->filter($filter);
            }
        }

        // Set the index as the child action
        $this->childAction($this->index);

        parent::resolve($action);
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
}
