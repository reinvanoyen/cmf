<?php

namespace ReinVanOyen\Cmf\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Middleware\Authenticate as AuthenticationMiddleware;

class Authenticate extends AuthenticationMiddleware
{
    /**
     * @param \Illuminate\Http\Request $request
     * @param Closure $next
     * @param mixed ...$guards
     * @return \Illuminate\Http\JsonResponse|mixed|object
     */
    public function handle($request, Closure $next, ...$guards)
    {
        try {
            $guard = config('cmf.guard');

            if (! empty($guard)) {
                $guards[] = $guard;
            }

            return parent::handle($request, $next, ...$guards);

        } catch (AuthenticationException $e) {

            return response()->json(['message' => 'Unauthenticated',])->setStatusCode(401);
        }
    }
}
