<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class TreeOrderControls extends Component
{
    /**
     * @return string
     */
    public function type(): string
    {
        return 'tree-order-controls';
    }

    /**
     * @param Request $request
     * @return void
     */
    public function apiSortUp(Request $request)
    {
        if (method_exists($this->action, 'getSorter')) {
            $sorter = $this->action->getSorter();
            $sorter->sortUp($request);
        }
    }

    /**
     * @param Request $request
     * @return void
     */
    public function apiSortDown(Request $request)
    {
        if (method_exists($this->action, 'getSorter')) {
            $sorter = $this->action->getSorter();
            $sorter->sortDown($request);
        }
    }

    /**
     * @param Request $request
     * @return void
     */
    public function apiNestIn(Request $request)
    {
        if (method_exists($this->action, 'getSorter')) {
            $sorter = $this->action->getSorter();
            $sorter->nestIn($request);
        }
    }

    /**
     * @param Request $request
     * @return void
     */
    public function apiNestOut(Request $request)
    {
        if (method_exists($this->action, 'getSorter')) {
            $sorter = $this->action->getSorter();
            $sorter->nestOut($request);
        }
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $sorter = $this->action->getSorter();
        $relation = $sorter->getRelation();

        $depth = 0;

        $currModel = $model;
        while ($currModel = $currModel->{$relation}) {
            $depth++;
        }

        $data = [
            'depth' => $depth,
        ];

        $attributes[$this->getId().'_tree'] = $data;
    }
}
