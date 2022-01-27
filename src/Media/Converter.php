<?php

namespace ReinVanOyen\Cmf\Media;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use ReinVanOyen\Cmf\Models\MediaFile;
use Spatie\TemporaryDirectory\TemporaryDirectory;
use ReinVanOyen\Cmf\Contracts\MediaConverter;

abstract class Converter implements MediaConverter
{
    /**
     * @var array $conversions
     */
    protected $conversions = [];

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
     * @param string $conversion
     * @param MediaFile $file
     * @return mixed
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function streamConvertedFile(string $conversion, MediaFile $file)
    {
        $baseFilename = basename($file->filename);

        // If the file has a specific conversion disk set, use that one.
        // Otherwise, use the one set in the config or fall back to the disk of the original file
        $conversionsDisk = $file->conversions_disk ?: config('cmf.media_conversions_disk', $file->disk);

        $storage = Storage::disk($conversionsDisk);
        $conversionPath = 'conversions/'.$conversion.'/'.$baseFilename;

        // Stream the file if it exists
        if ($storage->exists($conversionPath)) {
            return $storage->response($conversionPath);
        }

        // Create a temporary directory for converting the file
        $tempDirectory = (new TemporaryDirectory())->create();
        $tempFilePath = $tempDirectory->path().'/'.$baseFilename;

        // Store the file in the temporary directory
        $fileStorage = Storage::disk($file->disk);
        File::put($tempFilePath, $fileStorage->get($file->filename));

        // Convert the file, receive a new path
        $path = $this->convertFile($conversion, $tempFilePath);

        // Put the converted file on the disk
        $storage->put($conversionPath, File::get($path));

        // Update the file with the used conversion disk
        $file->conversions_disk = $conversionsDisk;
        $file->save();

        // Delete the temporary directory
        $tempDirectory->delete();

        // Stream the file
        return $storage->response($conversionPath);
    }
}
