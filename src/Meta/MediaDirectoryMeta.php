<?php

namespace ReinVanOyen\Cmf\Meta;

use ReinVanOyen\Cmf\Meta;
use ReinVanOyen\Cmf\Models\MediaDirectory;

class MediaDirectoryMeta extends Meta
{
    /**
     * @var string $model
     */
    protected static $model = MediaDirectory::class;

    /**
     * @return string
     */
    public static function getPlural(): string
    {
        return 'Directories';
    }

    /**
     * @return string
     */
    public static function getSingular(): string
    {
        return 'Directory';
    }
}
