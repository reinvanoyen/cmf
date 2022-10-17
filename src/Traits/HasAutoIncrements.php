<?php

namespace ReinVanOyen\Cmf\Traits;

trait HasAutoIncrements
{
    /**
     * @var $increment
     */
    protected $increment;

    /**
     * Boot the Incrementable trait for a model.
     *
     * @return void
     */
    public static function bootHasAutoIncrements()
    {
        static::creating(function ($model) {
            foreach ($model->autoIncrement as $autoIncrementColumn) {
                $model->{$autoIncrementColumn} = $model->newQuery()->max($autoIncrementColumn) + 1;
            }
        });
    }
}
