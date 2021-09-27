<?php

namespace ReinVanOyen\Cmf\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Cmf;
use ReinVanOyen\Cmf\MakeableStorage;
use ReinVanOyen\Cmf\PathResolver;

/**
 * Class ComponentsController
 * @package ReinVanOyen\Cmf\Http\Controllers
 */
class ComponentsController extends Controller
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
     * @param string $slug
     * @param string $action
     * @return array
     */
    public function execute(Request $request, string $moduleId, string $actionId, int $componentId, string $executeId)
    {
        $action = $this->pathResolver->action($request, $moduleId, $actionId);

        if ($action) {
            $makeable = MakeableStorage::get($componentId);

            if ($makeable) {
                return $makeable->$executeId($request);
            }
        }

        abort(404);
    }
}
