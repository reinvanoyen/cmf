<?php

namespace ReinVanOyen\Cmf\Traits;

use ReinVanOyen\Cmf\MakeableStorage;

trait CanBeMade
{
    /**
     * @var int $id
     */
    private int $id;

    /**
     * @var bool $isResolved
     */
    private bool $isResolved = false;

    /**
     * @param ...$arguments
     * @return mixed
     */
    public static function make(...$arguments): mixed
    {
        $makeable = new static(...$arguments);
        app(MakeableStorage::class)->store($makeable);
        return $makeable;
    }

    /**
     * @param int $id
     * @return void
     */
    final public function setId(int $id)
    {
        $this->id = $id;
        $this->export('id', $this->id);
    }

    /**
     * @return int
     */
    final protected function getId(): int
    {
        return $this->id;
    }
}
