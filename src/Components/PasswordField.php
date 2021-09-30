<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class PasswordField extends TextField
{
    public function type(): string
    {
        return 'password-field';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = '';
    }

    /**
     * @param Model $model
     * @param \Illuminate\Http\Request $request
     */
    public function save(Model $model, $request)
    {
        if ($request->input($this->getName())) {
            $model->{$this->getName()} = Hash::make($request->input($this->getName()));
        }
    }
}
