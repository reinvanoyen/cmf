<?php

namespace ReinVanOyen\Cmf\Traits;

trait HasValidation
{
    /**
     * @var array $validationRules
     */
    private $validationRules = [];

    /**
     * @param array $validationRules
     * @return $this
     */
    public function validate(array $validationRules)
    {
        $this->validationRules = $validationRules;

        $this->export('isRequired', $this->isRequired());

        return $this;
    }

    /**
     * @return bool
     */
    private function isRequired(): bool
    {
        return (in_array('required', $this->validationRules));
    }
}
