<?php

namespace ReinVanOyen\Cmf\Support;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str as Stri;

class Str
{
    public static function labelify(string $string): string
    {
        $string = str_replace('_', ' ', $string);
        return $string;
    }

    public static function cleanFilename(string $filename): string
    {
        $ext = File::extension($filename);
        $filename = self::removeFilenameExtension($filename);
        return Stri::slug($filename).'.'.$ext;
    }

    public static function removeFilenameExtension(string $filename): string
    {
        $ext = File::extension($filename);
        if (Stri::endsWith($filename, $ext)) {
            return substr($filename, 0, -strlen($ext));
        }
        return $filename;
    }
}
