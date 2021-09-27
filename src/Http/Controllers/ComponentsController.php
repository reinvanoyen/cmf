<?php

namespace ReinVanOyen\Cmf\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\MakeableStorage;
use ReinVanOyen\Cmf\PathResolver;

/**
 * Class ComponentsController
 * @package ReinVanOyen\Cmf\Http\Controllers
 */
class ComponentsController extends Controller
{
    /**
     * @var MakeableStorage $makeableStorage
     */
    private $makeableStorage;

    /**
     * @var PathResolver $pathResolver
     */
    private $pathResolver;

    /**
     * ModulesController constructor.
     * @param PathResolver $pathResolver
     */
    public function __construct(MakeableStorage $makeableStorage, PathResolver $pathResolver)
    {
        $this->makeableStorage = $makeableStorage;
        $this->pathResolver = $pathResolver;
    }

    /**
     * @param Request $request
     * @param string $moduleId
     * @param string $actionId
     * @param int $componentId
     * @param string $executeId
     * @return mixed
     */
    public function execute(Request $request, string $moduleId, string $actionId, int $componentId, string $executeId)
    {
        $action = $this->pathResolver->action($request, $moduleId, $actionId);

        if ($action) {

            $component = $this->makeableStorage->get($componentId);

            if ($component && method_exists($component, $executeId)) {
                return $component->$executeId($request);
            }
        }

        abort(404);
    }
}
