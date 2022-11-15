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
     * @return array
     */
    public function getConversions(): array;

    /**
     * @param string $name
     * @return mixed
     */
    public function isValidConversion(string $name);

    /**
     * @param string $name
     * @param string $tempFilePath
     * @return string
     */
    public function convertFile(string $name, string $tempFilePath): string;

    /**
     * @param string $conversion
     * @param MediaFile $file
     * @return mixed
     */
    public function streamConvertedFile(string $conversion, MediaFile $file);
}
