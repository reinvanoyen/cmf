<?php

namespace ReinVanOyen\Cmf\Traits;

trait HasTooltip
{
    /**
     * @param string $text
     * @return $this
     */
    public function tooltip(string $text)
    {
        $this->export('tooltip', $text);
        return $this;
    }
}
