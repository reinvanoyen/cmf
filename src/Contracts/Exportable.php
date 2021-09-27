<?php

namespace ReinVanOyen\Cmf\Contracts;

interface Exportable
{
    /**
     * @return string
     */
    public function type(): string;

    /**
     * @param $key
     * @param $value
     * @return mixed
     */
    public function export($key, $value);

    /**
     * @return array
     */
    public function exportAll(): array;

    /**
     * @return mixed
     */
    public function jsonSerialize();
}
