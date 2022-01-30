<?php

namespace ReinVanOyen\Cmf\Media;

use Illuminate\Support\Facades\Storage;
use ReinVanOyen\Cmf\Models\MediaDirectory;
use ReinVanOyen\Cmf\Models\MediaFile;
use \ReinVanOyen\Cmf\Support\Str;

class FileAdder
{
    /**
     * @param  \Illuminate\Http\File|\Illuminate\Http\UploadedFile $file
     * @param string $filename
     * @param int|null $directory
     * @return MediaFile
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

        // Make a new database entry for the uploaded file
        $mediaFile = new MediaFile();
        $mediaFile->name = $filename;
        $mediaFile->filename = $filePath;
        $mediaFile->disk = $disk;
        $mediaFile->mime_type = $storage->mimeType($filePath);
        $mediaFile->size = $storage->size($filePath);

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
