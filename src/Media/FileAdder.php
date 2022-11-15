<?php

namespace ReinVanOyen\Cmf\Media;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use ReinVanOyen\Cmf\Models\MediaDirectory;
use ReinVanOyen\Cmf\Models\MediaFile;
use \ReinVanOyen\Cmf\Support\Str;

class FileAdder
{
    /**
     * @param $file
     * @param string $filename
     * @param int|null $directory
     * @return MediaFile
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function addFile($file, string $filename, int $directory = null): MediaFile
    {
        $filename = Str::cleanFilename($filename);

        // Where to move the file
        $disk = config('cmf.media_library_disk');
        $storage = Storage::disk($disk);
        $location = 'media/'.date('Y/m');

        // Put the file on the media disk using a stream
        $filePath = $storage->putFile($location, $file);

        // Check if it's an image
        $mime = $storage->mimeType($filePath);

        $imageMimetypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
        ];

        $width = null;
        $height = null;

        // If it's an image, get its dimensions
        if (in_array($mime, $imageMimetypes)) {
            $image = Image::make($storage->get($filePath));
            $width = $image->width();
            $height = $image->height();
        }

        // Make a new database entry for the uploaded file
        $mediaFile = new MediaFile();
        $mediaFile->name = $filename;
        $mediaFile->filename = $filePath;
        $mediaFile->disk = $disk;
        $mediaFile->mime_type = $mime;
        $mediaFile->size = $storage->size($filePath);
        $mediaFile->width = $width;
        $mediaFile->height = $height;

        // If the request input contains a specified directory, add the file to the directory
        if ($directory) {
            $parentDirectory = MediaDirectory::findOrFail($directory);
            $mediaFile->directory()->associate($parentDirectory);
        }

        // Save the file and give back a MediaFileResource of the newly created file
        $mediaFile->save();

        return $mediaFile;
    }
}
