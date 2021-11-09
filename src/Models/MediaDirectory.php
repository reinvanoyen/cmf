<?php

namespace ReinVanOyen\Cmf\Models;

use Illuminate\Database\Eloquent\Model;

class MediaDirectory extends Model
{
    protected $table = 'media_directories';

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function directory()
    {
        return $this->belongsTo(MediaDirectory::class, 'media_directory_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function directories()
    {
        return $this->hasMany(MediaDirectory::class, 'media_directory_id')->orderBy('name');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function files()
    {
        return $this->hasMany(MediaFile::class, 'media_directory_id')->orderBy('name');
    }

    /**
     * @return bool|null
     */
    public function delete()
    {
            foreach ($this->files as $file) {
                $file->delete();
            }

            foreach ($this->directories as $directory) {
                $directory->delete();
            }

        return parent::delete();
    }

    /*
    protected static function boot() {
        parent::boot();
        static::deleting(function($model) {

            foreach ($model->files as $file) {
                $file->delete();
            }

            foreach ($model->directories as $directory) {
                $directory->delete();
            }
        });
    }*/
}
