<?php

namespace ReinVanOyen\Cmf\Http\Middleware;

use ReinVanOyen\Cmf\Events\ServingCmf;

class DispatchServingCmfEvent
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Illuminate\Http\Response
     */
    public function handle($request, $next)
    {
        ServingCmf::dispatch($request);

        return $next($request);
    }
}
