<?php

namespace ReinVanOyen\Cmf\Components;

class Section extends Compound
{
    /**
     * @param string $title
     * @return $this
     */
    public function title(string $title)
    {
        $this->export('title', $title);
        return $this;
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'section';
    }
}
