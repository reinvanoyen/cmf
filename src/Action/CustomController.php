<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;

/**
 * Class CustomController
 * @package ReinVanOyen\Cmf\Action
 */
class CustomController extends Action
{
    /**
     * @var callable $controller
     */
    private $controller;

    /**
     * CustomController constructor.
     * @param callable $controller
     */
    public function __construct(callable $controller)
    {
        $this->controller = $controller;
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'custom-controller';
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function apiController(Request $request)
    {
        $controller = $this->controller;
        return $controller($request);
    }
}
