<?php

namespace ReinVanOyen\Cmf\Contracts;

/**
 * Interface Makeable
 * @package ReinVanOyen\Cmf\Contracts
 */
interface Makeable
{
    /**
     * @param mixed ...$arguments
     * @return mixed
     */
    public static function make(...$arguments): mixed;

    /**
     * @param int $id
     * @return mixed
     */
    public function setId(int $id);
}
