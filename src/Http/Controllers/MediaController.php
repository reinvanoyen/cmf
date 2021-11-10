<?php

namespace ReinVanOyen\Cmf\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use ReinVanOyen\Cmf\Http\Resources\MediaDirectoryCollection;
use ReinVanOyen\Cmf\Http\Resources\MediaDirectoryResource;
use ReinVanOyen\Cmf\Http\Resources\MediaFileCollection;
use ReinVanOyen\Cmf\Http\Resources\MediaFileResource;
use ReinVanOyen\Cmf\Models\MediaDirectory;
use ReinVanOyen\Cmf\Models\MediaFile;
use Spatie\TemporaryDirectory\TemporaryDirectory;

/**
 * Class MediaController
 * @package ReinVanOyen\Cmf\Http\Controllers
 */
class MediaController extends Controller
{
    /**
     * @param Request $request
     * @param string $conversion
     * @param int $id
     * @param string $filename
     * @return mixed
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function streamFileConversion(Request $request, string $conversion, int $id, string $filename)
    {
        $file = MediaFile::where('id', '=', $id)
            ->where('name', '=', $filename)
            ->firstOrFail();

        $baseFilename = basename($file->filename);

        $storage = Storage::disk($file->disk);
        $conversionPath = 'conversions/'.$conversion.'/'.$baseFilename;

        if ($storage->exists($conversionPath)) {
            return $storage->response($conversionPath);
        }

        $tempDirectory = (new TemporaryDirectory())->create();
        $tempFilePath = $tempDirectory->path().'/'.$baseFilename;

        File::put($tempFilePath, $storage->get($file->filename));

        $image = Image::make($tempFilePath);
        // Start of image manipulation
        $image->fit(250, 250);
        // End of image manipulation
        $image->save();

        $storage->put($conversionPath, File::get($tempFilePath));
        $tempDirectory->delete();
        return $storage->response($conversionPath);
    }

    /**
     * @param Request $request
     * @param int $id
     * @param string $filename
     * @return mixed
     */
    public function streamFile(Request $request, int $id, string $filename)
    {
        $file = MediaFile::where('id', '=', $id)
            ->where('name', '=', $filename)
            ->firstOrFail();

        return Storage::disk($file->disk)
            ->response($file->filename);
    }

    /**
     * @param Request $request
     * @return MediaFileResource
     */
    public function upload(Request $request)
    {
        $disk = config('cmf.media_library_disk');
        $storage = Storage::disk($disk);

        $file = $request->file('file');
        $filename = \ReinVanOyen\Cmf\Support\Str::cleanFilename($file->getClientOriginalName());
        $path = $file->store('media/'.date('Y/m'), $disk);

        $mediaFile = new MediaFile();
        $mediaFile->name = $filename;
        $mediaFile->filename = $path;
        $mediaFile->disk = $disk;
        $mediaFile->mime_type = $storage->mimeType($path);
        $mediaFile->size = $storage->size($path);

        if ($request->input('directory')) {
            $parentDirectory = MediaDirectory::findOrFail($request->input('directory'));
            $mediaFile->directory()->associate($parentDirectory);
        }

        $mediaFile->save();

        return new MediaFileResource($mediaFile);
    }

    /**
     * @param Request $request
     * @return MediaDirectoryCollection
     */
    public function loadDirectories(Request $request)
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
     * @param Request $request
     * @return MediaFileCollection
     */
    public function loadFiles(Request $request)
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
    public function path(Request $request)
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

    /**
     * @param Request $request
     * @return MediaDirectoryResource
     */
    public function renameDirectory(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|max:100',
        ]);

        $mediaDirectory = MediaDirectory::findOrFail($request->input('directory'));
        $mediaDirectory->name = $data['name'];
        $mediaDirectory->save();

        return new MediaDirectoryResource($mediaDirectory);
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function deleteDirectory(Request $request)
    {
        $mediaDirectory = MediaDirectory::findOrFail($request->input('directory'));
        $mediaDirectory->delete();

        return true;
    }

    /**
     * @param Request $request
     * @return MediaDirectoryResource
     */
    public function createDirectory(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|max:100',
        ]);

        $mediaDirectory = new MediaDirectory();
        $mediaDirectory->name = $data['name'];

        if ($request->input('directory')) {
            $parentDirectory = MediaDirectory::findOrFail($request->input('directory'));
            $mediaDirectory->directory()->associate($parentDirectory);
        }

        $mediaDirectory->save();

        return new MediaDirectoryResource($mediaDirectory);
    }

    /**
     * @param Request $request
     * @return MediaFileResource
     */
    public function renameFile(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|max:100',
        ]);

        $mediaFile = MediaFile::findOrFail($request->input('file'));

        $ext = File::extension($mediaFile->filename);
        $filename = \ReinVanOyen\Cmf\Support\Str::removeFilenameExtension($data['name']);
        $filename = Str::slug($filename);

        $mediaFile->name = $filename.'.'.$ext;
        $mediaFile->save();

        return new MediaFileResource($mediaFile);
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function deleteFile(Request $request)
    {
        $mediaFile = MediaFile::findOrFail($request->input('file'));
        $mediaFile->delete();

        return true;
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function deleteFiles(Request $request)
    {
        $ids = json_decode($request->input('files'));
        $mediaFiles = MediaFile::whereIn('id', $ids)->get();

        foreach ($mediaFiles as $file) {
            $file->delete();
        }

        return true;
    }
}
