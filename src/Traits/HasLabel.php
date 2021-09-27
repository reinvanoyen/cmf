<?php

namespace ReinVanOyen\Cmf\Traits;

trait HasLabel
{
    /**
     * @param string $text
     * @return $this
     */
    public function label(string $text)
    {
        $this->export('label', $text);
        return $this;
    }
}
