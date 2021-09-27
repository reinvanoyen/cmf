<?php

namespace ReinVanOyen\Cmf\Contracts;

interface Validatable
{
    /**
     * @return string
     */
    public function validationKey(): string;
}
