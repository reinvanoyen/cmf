<?php

namespace ReinVanOyen\Cmf\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Cmf;
use ReinVanOyen\Cmf\PathResolver;

/**
 * Class ModulesController
 * @package ReinVanOyen\Cmf\Http\Controllers
 */
class ModulesController extends Controller
{
    /**
     * @var PathResolver $pathResolver
     */
    private $pathResolver;

    /**
     * ModulesController constructor.
     * @param PathResolver $pathResolver
     * @param Cmf $cmf
     */
    public function __construct(PathResolver $pathResolver)
    {
        $this->pathResolver = $pathResolver;
    }

    /**
     * @return array
     */
    public function index(Request $request)
    {
        return $this->pathResolver->modules();
    }

    /**
     * @param Request $request
     * @param string $moduleId
     * @param string $actionId
     * @return \ReinVanOyen\Cmf\Action\Action|null
     */
    public function action(Request $request, string $moduleId, string $actionId)
    {
        $action = $this->pathResolver->action($request, $moduleId, $actionId);

        if (! $action) {
            abort(404);
        }

        return $action;
    }
}
