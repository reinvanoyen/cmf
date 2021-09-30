<?php

namespace ReinVanOyen\Cmf\Traits;

use ReinVanOyen\Cmf\MakeableStorage;

trait CanBeMade
{
    /**
     * @var int $id
     */
    private $id;

    /**
     * @var bool $isResolved
     */
    private $isResolved = false;

    /**
     * @param mixed ...$arguments
     * @return static
     */
    public static function make(...$arguments)
    {
        $storage = app(MakeableStorage::class);
        $makeable = new static(...$arguments);
        $storage->store($makeable);
        return $makeable;
    }

    /**
     * @param int $id
     */
    final public function setId(int $id)
    {
        $this->id = $id;
        $this->export('id', $this->id);
    }

    /**
     * @return int
     */
    final protected function getId()
    {
        return $this->id;
    }
}
