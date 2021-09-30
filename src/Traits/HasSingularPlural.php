<?php

namespace ReinVanOyen\Cmf\Traits;

trait HasSingularPlural
{
    /**
     * @param string $singular
     * @return $this
     */
    public function singular(string $singular)
    {
        $this->export('singular', $singular);
        return $this;
    }

    /**
     * @param string $plural
     * @return $this
     */
    public function plural(string $plural)
    {
        $this->export('plural', $plural);
        return $this;
    }
}
