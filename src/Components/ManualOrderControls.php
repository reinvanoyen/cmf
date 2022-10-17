<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Http\Request;

class ManualOrderControls extends Component
{
    /**
     * @return string
     */
    public function type(): string
    {
        return 'manual-order-controls';
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function apiSortUp(Request $request)
    {
        $sorter = $this->action->getSorter();
        $sorter->sortUp($request);

        return true;
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function apiSortDown(Request $request)
    {
        $sorter = $this->action->getSorter();
        $sorter->sortDown($request);

        return true;
    }
}
