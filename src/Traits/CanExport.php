<?php

namespace ReinVanOyen\Cmf\Traits;

trait CanExport
{
    /**
     * @var array $exports
     */
    private $exports = [];

    /**
     * @param string $key
     * @param mixed $value
     * @return void
     */
    protected function export(string $key, mixed $value)
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
