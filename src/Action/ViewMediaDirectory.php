<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\MediaDirectoryCollection;
use ReinVanOyen\Cmf\Http\Resources\MediaFileCollection;
use ReinVanOyen\Cmf\Models\MediaDirectory;
use ReinVanOyen\Cmf\Models\MediaFile;

class ViewMediaDirectory extends Action
{
    /**
     * @return string
     */
    public function type(): string
    {
        return 'view-media-directory';
    }

    /**
     * @return string
     */
    public function apiLoadDirectories(Request $request)
    {
        if ($request->get('directory')) {
            $directory = MediaDirectory::findOrFail($request->get('directory'));
            $directories = $directory->directories;
        } else {
            $directories = MediaDirectory::whereNull('media_directory_id')->orderBy('name')->get();
        }

        return new MediaDirectoryCollection($directories);
    }


    /**
     * @return string
     */
    public function apiLoadFiles(Request $request)
    {
        if ($request->get('directory')) {
            $directory = MediaDirectory::findOrFail($request->get('directory'));
            $files = $directory->files;
        } else {
            $files = MediaFile::whereNull('media_directory_id')->orderBy('name')->get();
        }

        return new MediaFileCollection($files);
    }

    /**
     * @param Request $request
     * @return array
     */
    public function apiPath(Request $request)
    {
        if (! $request->input('directory')) {
            return [];
        }

        $mediaDirectory = MediaDirectory::findOrFail($request->input('directory'));
        $path = [$mediaDirectory,];

        while ($mediaDirectory->directory) {
            $mediaDirectory = $mediaDirectory->directory;
            array_unshift($path, $mediaDirectory);
        }

        return $path;
    }
}
