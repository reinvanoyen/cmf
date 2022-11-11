<?php

namespace ReinVanOyen\Cmf\Http\Controllers;

use Illuminate\Routing\Controller;
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
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function index()
    {
        return view('cmf::index', [
            'cmf' => $this->cmf,
        ]);
    }
}
