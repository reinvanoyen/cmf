<?php

namespace ReinVanOyen\Cmf\Sorters;

use Illuminate\Http\Request;

/**
 * Class ManualOrderSorter
 * @package ReinVanOyen\Cmf\Sorters
 */
class ManualOrderSorter extends Sorter
{
    /**
     * @var string $column
     */
    private string $column;

    /**
     * ManualOrderSorter constructor.
     * @param string $column
     */
    public function __construct(string $column)
    {
        $this->column = $column;
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'manual-order-sorter';
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

        $this->switchValue($results, $id, -1);
    }

    /**
     * @param Request $request
     */
    public function sortDown(Request $request)
    {
        $results = $this->getAction()->apiLoad($request);
        $id = (int) $request->get('id');

        $this->switchValue($results, $id, 1);
    }

    /**
     * @param $collection
     * @param int $currentId
     * @param int $offset
     */
    private function switchValue($collection, int $currentId, int $offset)
    {
        $itemIndex = $collection->search(function($item) use ($currentId) {
            return $item->id === $currentId;
        });

        $currentItem = $collection->get($itemIndex);
        $prevItem = $collection->get($itemIndex + $offset);

        if ($currentItem && $prevItem) {

            // Get the original resources
            $currentItem = $currentItem->resource;
            $prevItem = $prevItem->resource;

            $currentOrder = $currentItem->{$this->column};
            $prevOrder = $prevItem->{$this->column};

            $currentItem->{$this->column} = $prevOrder;
            $currentItem->save();

            $prevItem->{$this->column} = $currentOrder;
            $prevItem->save();
        }
    }
}
