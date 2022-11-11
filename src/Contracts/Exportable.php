<?php

namespace ReinVanOyen\Cmf\Contracts;

interface Exportable
{
    /**
     * @return string
     */
    public function type(): string;

    /**
     * @return mixed
     */
    public function jsonSerialize();
}
