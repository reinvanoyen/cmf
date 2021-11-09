<?php

namespace ReinVanOyen\Cmf\Meta;

use ReinVanOyen\Cmf\Meta;
use ReinVanOyen\Cmf\Models\MediaFile;

class MediaFileMeta extends Meta
{
    /**
     * @var string $model
     */
    protected static $model = MediaFile::class;

    /**
     * @return string
     */
    public static function getPlural(): string
    {
        return 'Files';
    }

    /**
     * @return string
     */
    public static function getSingular(): string
    {
        return 'File';
    }
}
