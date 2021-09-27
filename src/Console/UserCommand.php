<?php

namespace ReinVanOyen\Cmf\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class UserCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cmf:user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates a new user';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        $name = $this->ask('Name');
        $email = $this->ask('Email Address');
        $password = $this->secret('Password');

        $guard = config('auth.defaults.guard');
        $provider = config('auth.guards.'.$guard.'.provider');
        $model = config('auth.providers.'.$provider.'.model');

        $user = new $model([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        $user->save();
        $this->info('User created successfully.');
    }
}
