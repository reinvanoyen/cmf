<?php

namespace ReinVanOyen\Cmf\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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

        parent::delete();

        $storage = Storage::disk($disk);
        $storage->delete($filename);
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
}
