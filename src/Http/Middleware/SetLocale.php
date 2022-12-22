<?php

namespace ReinVanOyen\Cmf\Http\Middleware;

use Illuminate\Support\Facades\App;

class SetLocale
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
        App::setLocale(config('cmf.locale'));

        return $next($request);
    }
}
