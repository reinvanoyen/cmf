<?php

namespace ReinVanOyen\Cmf\Rules;

use Illuminate\Contracts\Validation\Rule;
use ReinVanOyen\Cmf\Models\MediaFile;

class Mimetype implements Rule
{
    /**
     * @var string[] $mimetypes
     */
    private $mimetypes;

    /**
     * Mimetype constructor.
     * @param string ...$mimetypes
     */
    public function __construct(string ...$mimetypes)
    {
        $this->mimetypes = $mimetypes;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $file = MediaFile::find($value);

        if (!$file) {
            return true;
        }

        return in_array($file->mime_type, $this->mimetypes);
    }

    /**
     * Get the validation error message.
     *
     * @return array|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Translation\Translator|string|null
     */
    public function message()
    {
        return trans('cmf::validation.mimetype', [
            'mimetypes' => join(', ', $this->mimetypes),
        ]);
    }
}
