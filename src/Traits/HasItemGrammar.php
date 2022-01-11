<?php

namespace ReinVanOyen\Cmf\Traits;

trait HasItemGrammar
{
    /**
     * @param string $plural
     * @return $this
     */
    public function plural(string $plural)
    {
        $this->export('plural', $plural);
        return $this;
    }

    /**
     * @param string $singular
     * @return $this
     */
    public function singular(string $singular)
    {
        $this->export('singular', $singular);
        return $this;
    }
}
