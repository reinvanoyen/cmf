<?php

namespace ReinVanOyen\Cmf\Http\Controllers;

use Illuminate\Routing\Controller;

class TranslationsController extends Controller
{
    public function javascript()
    {
        $translations = [
            'snippets' => trans('cmf::snippets'),
            'validation' => trans('cmf::validation'),
        ];

        $content = 'window.i18n = '.json_encode($translations).';';

        return response($content, 200)
            ->header('Content-Type', 'application/javascript');
    }
}
