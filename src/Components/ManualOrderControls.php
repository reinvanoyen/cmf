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
}
