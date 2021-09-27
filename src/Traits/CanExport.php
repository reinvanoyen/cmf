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
    public function export($key, $value)
    {
        $this->exports[$key] = $value;
    }

    /**
     * @return array|mixed
     */
    public function exportAll(): array
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
