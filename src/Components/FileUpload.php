<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use League\Flysystem\Util;
use ReinVanOyen\Cmf\Models\MediaFile;

class FileUpload extends Component
{
    /**
     * @return string
     */
    public function type(): string
    {
        return 'file-upload';
    }

    /**
     * @param Request $request
     * @return string
     */
    public function apiUpload(Request $request)
    {
        $disk = config('cmf.media_library_disk');
        $storage = Storage::disk($disk);

        $file = $request->file('file');

        $filename = Util::normalizePath($file->getClientOriginalName());
        $path = $file->store('media', $disk);

        $mediaFile = new MediaFile();
        $mediaFile->name = $filename;
        $mediaFile->filename = $path;
        $mediaFile->disk = $disk;
        $mediaFile->mime_type = $storage->mimeType($path);
        // $mediaFile->size = $storage->size($path);
        $mediaFile->save();

        return $mediaFile;
    }
}
