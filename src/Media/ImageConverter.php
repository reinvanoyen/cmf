<?php

namespace ReinVanOyen\Cmf\Media;

use Intervention\Image\Facades\Image;

class ImageConverter extends Converter
{
    /**
     * @param string $name
     * @param string $tempFilePath
     * @return string
     */
    public function convertFile(string $name, string $tempFilePath): string
    {
        $image = Image::make($tempFilePath);

        // Get the user conversion call and execute it
        $conversionCall = $this->conversions[$name];
        $conversionCall($image);

        // End of image manipulation, save the image to disk
        $image->save();

        return $tempFilePath;
    }
}
