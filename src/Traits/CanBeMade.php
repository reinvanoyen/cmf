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
     * @param mixed ...$arguments
     * @return static
     */
    public static function make(...$arguments)
    {
        $component = new static(...$arguments);
        app(MakeableStorage::class)->store($component);
        return $component;
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
