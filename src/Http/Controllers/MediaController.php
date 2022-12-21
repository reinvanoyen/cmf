<?php

namespace ReinVanOyen\Cmf\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use ReinVanOyen\Cmf\Contracts\MediaConverter;
use ReinVanOyen\Cmf\Http\Resources\MediaDirectoryCollection;
use ReinVanOyen\Cmf\Http\Resources\MediaDirectoryResource;
use ReinVanOyen\Cmf\Http\Resources\MediaFileCollection;
use ReinVanOyen\Cmf\Http\Resources\MediaFileResource;
use ReinVanOyen\Cmf\Media\FileAdder;
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
     * @var MediaConverter $mediaConverter
     */
    private $mediaConverter;

    /**
     * MediaController constructor.
     * @param MediaConverter $mediaConverter
     */
    public function __construct(MediaConverter $mediaConverter)
    {
        $this->mediaConverter = $mediaConverter;
    }

    /**
     * @param Request $request
     * @param string $conversion
     * @param int $id
     * @param string $filename
     * @return mixed
     */
    public function streamFileConversion(Request $request, string $conversion, int $id, string $filename)
    {
        $file = MediaFile::where('id', '=', $id)
            ->where('name', '=', $filename)
            ->firstOrFail();

        if (! $this->mediaConverter->isValidConversion($conversion)) {
            abort(404);
        }

        return $this->mediaConverter->streamConvertedFile($conversion, $file);
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
            ->response($file->filename, $file->name, [
                'Cache-Control' => 'max-age=86400, public',
        ]);
    }

    /**
     * @param Request $request
     * @param int $id
     * @param string $filename
     * @return mixed
     */
    public function redirectToFile(Request $request, int $id, string $filename)
    {
        $file = MediaFile::where('id', '=', $id)
            ->where('name', '=', $filename)
            ->firstOrFail();

        return redirect(
            Storage::disk($file->disk)
                ->url($file->filename)
        );
    }

    /**
     * @param FileAdder $fileAdder
     * @param Request $request
     * @return array|MediaFileResource
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function uploadChunk(FileAdder $fileAdder, Request $request)
    {
        $status = $request->input('status');
        $chunk = $request->file('chunk');
        $filename = $request->input('filename');

        if ($status === 'start') {

            $tempDirectory = (new TemporaryDirectory())->create();
            $tempPath = $tempDirectory->path().'/'.$filename.'.part';
            File::put($tempPath, $chunk->get());

            return [
                'status' => 'created',
                'path' => $tempPath,
            ];

        } else if ($request->exists('path')) {

            $path = $request->input('path');

            // Append the chunk to the temp file
            // We're not using Laravel's append methods here, because those also read the file contents,
            // for large files that often results in a memory allocation exhausted error
            file_put_contents($path, $chunk->get(), FILE_APPEND);

            if ($status === 'progress') {
                return [
                    'status' => 'progress',
                    'path' => $path,
                ];
            }

            if ($status === 'end') {

                $filename = basename($filename, '.part');

                // Add the file to the media library
                $mediaFile = $fileAdder->addFile(new \Illuminate\Http\File($path), $filename, $request->input('directory'));

                // Remove the temp directory
                File::deleteDirectory(dirname($path));

                return new MediaFileResource($mediaFile);
            }
        }

        return [
            'status' => 'failed',
        ];
    }

    /**
     * @param FileAdder $fileAdder
     * @param Request $request
     * @return MediaFileResource
     */
    public function upload(FileAdder $fileAdder, Request $request)
    {
        // The file being uploaded
        $file = $request->file('file');

        // Clean up the original file name
        $filename = \ReinVanOyen\Cmf\Support\Str::cleanFilename($file->getClientOriginalName());

        // Put the file on the disk and get the path (this uses automatic upload streaming)
        $mediaFile = $fileAdder->addFile($file, $filename, $request->input('directory'));

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
            return ['data' => []];
        }

        $mediaDirectory = MediaDirectory::findOrFail($request->input('directory'));
        $path = [$mediaDirectory,];

        while ($mediaDirectory->directory) {
            $mediaDirectory = $mediaDirectory->directory;
            array_unshift($path, $mediaDirectory);
        }

        return ['data' => $path,];
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
     * @return MediaDirectoryResource
     */
    public function moveDirectory(Request $request)
    {
        $directory = MediaDirectory::findOrFail($request->input('id'));

        if ($request->input('directory')) {
            $mediaDirectory = MediaDirectory::findOrFail($request->input('directory'));
            $directory->directory()->associate($mediaDirectory);
        } else {
            $directory->directory()->dissociate();
        }

        $directory->save();

        return new MediaDirectoryResource($directory);
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

    /**
     * @param Request $request
     * @return MediaFileResource
     */
    public function labelFile(Request $request)
    {
        $mediaFile = MediaFile::findOrFail($request->input('file'));
        $mediaFile->label = $request->input('label');
        $mediaFile->save();

        return new MediaFileResource($mediaFile);
    }

    /**
     * @param Request $request
     * @return MediaFileResource
     */
    public function updateFileDescription(Request $request)
    {
        $mediaFile = MediaFile::findOrFail($request->input('file'));
        $mediaFile->description = $request->input('description');
        $mediaFile->save();

        return new MediaFileResource($mediaFile);
    }

    /**
     * @param Request $request
     * @return MediaFileResource
     */
    public function updateFileCopyright(Request $request)
    {
        $mediaFile = MediaFile::findOrFail($request->input('file'));
        $mediaFile->copyright = $request->input('copyright');
        $mediaFile->save();

        return new MediaFileResource($mediaFile);
    }

    /**
     * @param Request $request
     * @return MediaFileResource
     */
    public function updateFileVisibility(Request $request)
    {
        $mediaFile = MediaFile::findOrFail($request->input('file'));
        $visibility = $request->input('visibility');

        $disk = Storage::disk($mediaFile->disk);
        $disk->setVisibility($mediaFile->filename, $visibility);

        $mediaFile->visibility = $visibility;
        $mediaFile->save();

        return new MediaFileResource($mediaFile);
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function updateFilesDescription(Request $request)
    {
        $ids = json_decode($request->input('files'));
        $mediaFiles = MediaFile::whereIn('id', $ids)->get();

        foreach ($mediaFiles as $file) {
            $file->description = $request->input('description');
            $file->save();
        }

        return true;
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function updateFilesCopyright(Request $request)
    {
        $ids = json_decode($request->input('files'));
        $mediaFiles = MediaFile::whereIn('id', $ids)->get();

        foreach ($mediaFiles as $file) {
            $file->copyright = $request->input('copyright');
            $file->save();
        }

        return true;
    }

    /**
     * @param Request $request
     * @return MediaFileResource
     */
    public function moveFile(Request $request)
    {
        $mediaFile = MediaFile::findOrFail($request->input('file'));

        if ($request->input('directory')) {
            $mediaDirectory = MediaDirectory::findOrFail($request->input('directory'));
            $mediaFile->directory()->associate($mediaDirectory);
        } else {
            $mediaFile->directory()->dissociate();
        }

        $mediaFile->save();

        return new MediaFileResource($mediaFile);
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function moveFiles(Request $request)
    {
        $ids = json_decode($request->input('files'));
        $mediaFiles = MediaFile::whereIn('id', $ids)->get();

        if ($request->input('directory')) {
            $mediaDirectory = MediaDirectory::findOrFail($request->input('directory'));
            foreach ($mediaFiles as $mediaFile) {
                $mediaFile->directory()->associate($mediaDirectory);
                $mediaFile->save();
            }
        } else {
            foreach ($mediaFiles as $mediaFile) {
                $mediaFile->directory()->dissociate();
                $mediaFile->save();
            }
        }

        return true;
    }
}
