<?php

namespace ReinVanOyen\Cmf\Http\Controllers;

use Illuminate\Routing\Controller;
use ReinVanOyen\Cmf\Cmf;
use OzdemirBurak\Iris\Color\Hex;

/**
 * Class FrontController
 * @package ReinVanOyen\Cmf\Http\Controllers
 */
class FrontController extends Controller
{
    /**
     * @var Cmf $cmf
     */
    private $cmf;

    /**
     * FrontController constructor.
     * @param Cmf $cmf
     */
    public function __construct(Cmf $cmf)
    {
        $this->cmf = $cmf;
    }

    /**
     * @return array|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function index()
    {
        $primaryColor = new Hex(config('cmf.theme.primary_color'));
        $primaryColorStrength = config('cmf.theme.primary_color_strength');
        $primaryColorSpin = config('cmf.theme.primary_color_spin');
        $primaryColorDesaturated = $primaryColor->spin($primaryColorSpin)->desaturate(100 - $primaryColorStrength);

        return view('cmf::index', [
            'title' => config('cmf.title'),
            'theme' => [
                'image' => url(config('cmf.theme.image')),
                'primary_color' => $primaryColor,
                'primary_color_alt_1' => ($primaryColor->isDark() ? $primaryColor->lighten(5) : $primaryColor->darken(5)),
                'primary_color_alt_2' => ($primaryColor->isDark() ? $primaryColor->lighten(20) : $primaryColor->darken(20)),
                'primary_color_alt_3' => $primaryColor->darken(10),
                'fill_color' => $primaryColorDesaturated->tint(95),
                'fill_color_alt_1' => $primaryColorDesaturated->tint(85),
                'fill_color_alt_2' => $primaryColorDesaturated->tint(75),
                'fill_color_alt_3' => $primaryColorDesaturated->tint(50),
                'border_radius' => config('cmf.theme.border_radius', '5px'),
            ],
            'cmf' => $this->cmf,
        ]);
    }
}
