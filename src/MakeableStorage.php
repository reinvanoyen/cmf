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
     * The last created id
     *
     * @var int $id
     */
    private $id;

    /**
     * An associative array holding all makeables, the key is the id, the value is the makeable
     *
     * @var array $makeable
     */
    private $makeables = [];

    /**
     * Store the makeable in the storage
     *
     * @param Makeable $makeable
     */
    public function store(Makeable $makeable)
    {
        // Increment id
        $this->id++;

        // Assign the id to the makeable
        $makeable->setId($this->getLastCreatedId());

        // Store it
        $this->makeables[$this->getLastCreatedId()] = $makeable;
    }

    /**
     * Get the makeable from the storage by id
     *
     * @param int $id
     * @return Makeable
     */
    public function get(int $id): Makeable
    {
        return $this->makeables[$id];
    }

    /**
     * Get the last created id
     *
     * @return mixed
     */
    public function getLastCreatedId()
    {
        return $this->id;
    }
}