<?php

namespace ReinVanOyen\Cmf\Contracts;

use ReinVanOyen\Cmf\Models\MediaFile;

interface MediaConverter
{
    /**
     * @param string $name
     * @param callable $conversion
     * @return mixed
     */
    public function registerConversion(string $name, callable $conversion);

    /**
     * @param string $name
     * @param MediaFile $file
     * @return mixed
     */
    public function streamConvertedFile(string $name, MediaFile $file);

    /**
     * @param string $name
     * @return mixed
     */
    public function isValidConversion(string $name);
}
