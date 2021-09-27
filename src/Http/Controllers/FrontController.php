<?php

namespace ReinVanOyen\Cmf\Http\Controllers;

use App\Http\Controllers\Controller;
use ReinVanOyen\Cmf\Cmf;

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
     * @return array
     */
    public function index()
    {
        return view('cmf::index', [
            'cmf' => $this->cmf,
        ]);
    }
}
