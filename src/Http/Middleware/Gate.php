<?php

namespace ReinVanOyen\Cmf\Http\Middleware;

use Closure;
use ReinVanOyen\Cmf\Facades\Cmf;

class Gate
{
    /**
     * @param $request
     * @param Closure $next
     * @return mixed|never
     */
    public function handle($request, Closure $next)
    {
        if ($user = $request->user()) {
            return (Cmf::checkGate($user) ? $next($request) : abort(403));
        }

        return $next($request);
    }
}
