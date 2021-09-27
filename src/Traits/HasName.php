<?php

namespace ReinVanOyen\Cmf\Traits;

trait HasName
{
    /**
     * @var string $name
     */
    private $name;

    /**
     * HasName constructor.
     * @param string $name
     */
    public function __construct(string $name)
    {
        $this->name($name);
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return $this
     */
    public function name(string $name)
    {
        $this->name = $name;
        $this->export('name', $name);
        return $this;
    }
}
