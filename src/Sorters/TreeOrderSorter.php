<?php

namespace ReinVanOyen\Cmf\Sorters;

use Illuminate\Http\Request;

class TreeOrderSorter extends Sorter
{
    /**
     * @var string $relation
     */
    private string $relation;

    /**
     * @var string $column
     */
    private string $column;

    /**
     * @param string $relation
     * @param string $column
     */
    public function __construct(string $relation, string $column)
    {
        $this->relation = $relation;
        $this->column = $column;
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'tree-order-sorter';
    }

    /**
     * @return string
     */
    public function getRelation(): string
    {
        return $this->relation;
    }

    /**
     * @param Request $request
     * @param $query
     * @return mixed
     */
    public function apply(Request $request, $query)
    {
        return $query->orderBy($this->column, 'asc');
    }

    /**
     * @param Request $request
     */
    public function sortUp(Request $request)
    {
        $results = $this->getAction()->apiLoad($request);
        $id = (int) $request->get('id');

        // @TODO
    }

    /**
     * @param Request $request
     */
    public function sortDown(Request $request)
    {
        $results = $this->getAction()->apiLoad($request);
        $id = (int) $request->get('id');

        // @TODO
    }

    /**
     * @param Request $request
     * @return void
     */
    public function nestIn(Request $request)
    {
        // Get all results
        $results = $this->getAction()->apiLoad($request);
        $id = (int) $request->get('id');

        // Get the item index
        $itemIndex = $results->search(function($item) use ($id) {
            return $item->id === $id;
        });

        // Get the item we're sorting
        $currentItem = $results->get($itemIndex);

        if ($currentItem) {

            // Get the original resource
            $currentItem = $currentItem->resource;

            // Get all items on this depth (with the same parent)
            $filtered = $this->getSiblings($results, $currentItem);

            // Get the item index
            $itemIndex = $filtered->search(function($item) use ($id) {
                return $item->id === $id;
            });

            // Get the item we're sorting from the filtered list
            $currentItem = $filtered->get($itemIndex);
            // Get the previous item, relative to the item we're sorting
            $prevItem = $filtered->get($itemIndex - 1);

            if ($prevItem) {
                // Get the original resources
                $currentItem = $currentItem->resource;
                $prevItem = $prevItem->resource;

                // Associate the item with the previous item
                $currentItem->{$this->relation}()->associate($prevItem);
                $currentItem->save();
            }
        }
    }

    /**
     * @param Request $request
     * @return void
     */
    public function nestOut(Request $request)
    {
        // First get all items
        $results = $this->getAction()->apiLoad($request);
        $id = (int) $request->get('id');

        // Find the index of the item we're sorting
        $itemIndex = $results->search(function($item) use ($id) {
            return $item->id === $id;
        });

        // Get the item we're sorting
        $currentItem = $results->get($itemIndex);

        if ($currentItem) {

            $currentItem = $currentItem->resource;
            $siblings = $this->getSiblings($results, $currentItem);
            $lastSibling = $siblings->last()->resource;

            // Get the needed parents
            $currentParent = $currentItem->{$this->relation};
            $targetParent = $currentParent->{$this->relation};

            // Check if the current item is also the last sibling
            if ($lastSibling->id !== $currentItem->id) {
                // Insert the current item right before its parent
                $this->insertAtPosition($currentParent->{$this->column}, $results, $currentItem);
            }

            // Associate or dissociate accordingly
            if ($targetParent) {
                $currentItem->{$this->relation}()->associate($targetParent);
            } else {
                $currentItem->{$this->relation}()->dissociate();
            }

            $currentItem->save();
        }
    }

    private function getSiblings($collection, $model)
    {
        // Get all items on this depth (with the same parent)
        return $collection->filter(function ($value, int $key) use ($model) {
            $resource = $value->resource;
            $resourceParent = $resource->{$this->relation};
            $parent = $model->{$this->relation};

            return (
                ($parent && $resourceParent && $parent->id === $resourceParent->id) ||
                (! $parent && ! $resourceParent)
            );
        })->values();
    }

    private function insertAtPosition(int $position, $all, $model)
    {
        $model->{$this->column} = $position;
        $model->save();

        // Filter the collection
        $afterCollection = $all->filter(function ($item, $index) use ($position, $model) {
            $resource = $item->resource;
            return ($resource->{$this->column} >= $position && $resource->id !== $model->id);
        })->values();

        $afterCollection->each(function ($item, $index) use ($position) {
            $resource = $item->resource;
            $resource->{$this->column} = $position + $index + 1;
            $resource->save();
        });
    }
}
