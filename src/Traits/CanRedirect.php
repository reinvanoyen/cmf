<?php

namespace ReinVanOyen\Cmf\Traits;

trait CanRedirect
{
    /**
     * @param string $path
     * @return $this
     */
    public function redirect(string $path)
    {
        $this->export('redirect', $path);
        return $this;
    }


    public function redirectBack()
    {
        $this->export('redirectBack', true);
        return $this;
    }
}
