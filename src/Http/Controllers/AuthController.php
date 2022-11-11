<?php

namespace ReinVanOyen\Cmf\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

/**
 * Class AuthController
 * @package ReinVanOyen\Cmf\Http\Controllers
 */
class AuthController extends Controller
{
    private $fields = [
        'id',
        'email',
        'name',
    ];

    /**
     * @param Request $request
     * @return ModelResource
     */
    public function user(Request $request)
    {
        ModelResource::fields($this->fields);

        return new ModelResource(Auth::user());
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|object|ModelResource
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (auth()->attempt($credentials, true)) {

            ModelResource::fields($this->fields);

            return new ModelResource(Auth::user());
        }

        return response()->json([
            'message' => 'Wrong credentials',
        ])->setStatusCode(401);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        auth()->logout();

        return response()->json([
            'message' => 'Logged out',
        ]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sessionInfo(Request $request)
    {
        return response()->json([
            'data' => [
                'csrfToken' => csrf_token(),
            ],
        ]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function csrfKeepAlive()
    {
        return response()->json([
            'data' => [
                'csrfToken' => csrf_token(),
            ],
        ]);
    }
}
