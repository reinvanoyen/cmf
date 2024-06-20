<?php

namespace ReinVanOyen\Cmf\Traits;

use ReinVanOyen\Cmf\Sorters\Sorter;

trait HasSorter
{
    /**
     * @param Sorter $sorter
     * @return \ReinVanOyen\Cmf\Filters\BelongsToFilter|HasSorter
     */
    public function sorter(Sorter $sorter): self
    {
        $sorter->resolve($this);
        $this->sorter = $sorter;
        $this->export('sorter', $this->sorter);
        return $this;
    }
}
