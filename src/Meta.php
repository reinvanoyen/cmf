<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Support\Str;

abstract class Meta
{
    /**
     * @var string $model
     */
    protected static $model;

    /**
     * @var string $title
     */
    protected static $title;

    /**
     * @var int $perPage
     */
    protected static $perPage = 10;

    /**
     * Get the model classname for the resource
     *
     * @return string
     */
    final public static function getModel(): string
    {
        return static::$model;
    }

    /**
     * Get the column representing the title for the resource
     *
     * @return string
     */
    final public static function getTitleColumn(): string
    {
        return static::$title;
    }

    /**
     * Get the singular word for the resource
     *
     * @return string
     */
    public static function getSingular(): string
    {
        return Str::lower(Str::singular(class_basename(static::$model)));
    }

    /**
     * Get the plural word for the resource
     *
     * @return string
     */
    public static function getPlural(): string
    {
        return Str::lower(Str::plural(class_basename(static::$model)));
    }

    /**
     * Get the amount of items per page for this resource
     *
     * @return int
     */
    public static function getPerPage(): int
    {
        return static::$perPage;
    }

    /**
     * @return array
     */
    public static function index(): array
    {
        return [];
    }

    /**
     * @return array
     */
    public static function create(): array
    {
        return [];
    }

    /**
     * @return array
     */
    public static function edit(): array
    {
        return static::create();
    }

    /**
     * @return array
     */
    public static function view(): array
    {
        return [];
    }
}
