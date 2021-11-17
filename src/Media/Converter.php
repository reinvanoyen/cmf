<?php

namespace ReinVanOyen\Cmf\Media;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use ReinVanOyen\Cmf\Contracts\MediaConverter;
use ReinVanOyen\Cmf\Models\MediaFile;
use Spatie\TemporaryDirectory\TemporaryDirectory;

class Converter implements MediaConverter
{
    /**
     * @var array $conversions
     */
    private $conversions = [];

    /**
     * @param string $name
     * @param callable $conversion
     */
    public function registerConversion(string $name, callable $conversion)
    {
        $this->conversions[$name] = $conversion;
    }

    /**
     * @param string $name
     * @return bool|mixed
     */
    public function isValidConversion(string $name)
    {
        return array_key_exists($name, $this->conversions);
    }

    /**
     * @param string $name
     * @param MediaFile $file
     * @return mixed
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function streamConvertedFile(string $name, MediaFile $file)
    {
        $baseFilename = basename($file->filename);

        $storage = Storage::disk($file->disk);
        $conversionPath = 'conversions/'.$name.'/'.$baseFilename;

        if ($storage->exists($conversionPath)) {
            return $storage->response($conversionPath);
        }

        $tempDirectory = (new TemporaryDirectory())->create();
        $tempFilePath = $tempDirectory->path().'/'.$baseFilename;

        File::put($tempFilePath, $storage->get($file->filename));

        // Create the image
        $image = Image::make($tempFilePath);

        // Get the user conversion call and execute it
        $conversionCall = $this->conversions[$name];
        $conversionCall($image);

        // End of image manipulation, save the image to disk
        $image->save();

        $storage->put($conversionPath, File::get($tempFilePath));
        $tempDirectory->delete();
        return $storage->response($conversionPath);
    }
}
