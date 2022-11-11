<?php

namespace ReinVanOyen\Cmf\Traits;

trait CanExport
{
    /**
     * @var array $exports
     */
    private $exports = [];

    /**
     * @param $key
     * @param $value
     */
    protected function export($key, $value)
    {
        $this->exports[$key] = $value;
    }

    /**
     * @return array|mixed
     */
    protected function exportAll(): array
    {
        $this->exports['type'] = $this->type();

        return $this->exports;
    }

    /**
     * @return array|mixed
     */
    public function jsonSerialize()
    {
        return $this->exportAll();
    }
}
