<?php

namespace ReinVanOyen\Cmf\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use ReinVanOyen\Cmf\Contracts\MediaConverter;

class MediaFile extends Model
{
    /**
     * @var string $table
     */
    protected $table = 'media_files';

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function directory()
    {
        return $this->belongsTo(MediaDirectory::class, 'media_directory_id');
    }

    /**
     * @return bool|null
     */
    public function delete()
    {
        $filename = $this->filename;
        $disk = $this->disk;

        $this->clearConversions();

        parent::delete();

        $storage = Storage::disk($disk);
        $storage->delete($filename);

        return true;
    }

    /**
     * Removes all conversions
     */
    public function clearConversions()
    {
        $converter = app(MediaConverter::class);

        // If the file has a specific conversion disk set, use that one.
        // Otherwise, use the one set in the config or fall back to the disk of the original file
        $storage = Storage::disk($this->conversions_disk ?: config('cmf.media_conversions_disk', $this->disk));

        $baseFilename = basename($this->filename);

        foreach ($converter->getConversions() as $conversion => $call) {

            $conversionPath = 'conversions/'.$conversion.'/'.$baseFilename;

            if ($storage->exists($conversionPath)) {
                $storage->delete($conversionPath);
            }
        }
    }

    /**
     * @return string
     */
    public function getVisAttribute(): string
    {
        if ($this->visibility) {
            return $this->visibility;
        }

        $storage = Storage::disk($this->disk);
        $this->visibility = $storage->getVisibility($this->filename);
        $this->save();

        return $this->visibility;
    }

    /**
     * @return bool
     */
    public function getIsImageAttribute(): bool
    {
        return in_array($this->mime_type, [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
        ]);
    }

    /**
     * @return bool
     */
    public function getIsLandscapeAttribute(): bool
    {
        return ($this->width > $this->height);
    }

    /**
     * @return bool
     */
    public function getIsPortraitAttribute(): bool
    {
        return ($this->height > $this->width);
    }
}
