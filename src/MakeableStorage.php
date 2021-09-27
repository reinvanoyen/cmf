<?php

namespace ReinVanOyen\Cmf;

use ReinVanOyen\Cmf\Contracts\Makeable;

/**
 * Class MakeableStorage
 * @package ReinVanOyen\Cmf
 */
class MakeableStorage
{
    /**
     * @var int $id
     */
    private static $id;

    /**
     * @var array $makeable
     */
    private static $makeables = [];

    /**
     * @param Makeable $makeable
     */
    public static function store(Makeable $makeable)
    {
        self::$id++;

        $makeable->setId(self::getLastCreatedId());
        self::$makeables[self::getLastCreatedId()] = $makeable;
    }

    /**
     * @param int $id
     * @return Makeable
     */
    public static function get(int $id): Makeable
    {
        return self::$makeables[$id];
    }

    /**
     * @return mixed
     */
    public static function getLastCreatedId()
    {
        return self::$id;
    }
}
