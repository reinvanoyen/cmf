<p align="center">
  <a href="https://github.com/reinvanoyen/cmf">
    <img width="200" src="https://raw.githubusercontent.com/reinvanoyen/cmf/master/intro.png" />
  </a>
</p>


## Laravel CMF

### Introduction

Laravel CMF aims to be a flexible and extendable solution for your content management needs. This 
software allows for rapid creation of your Content Management System while still allowing flexibility 
to make it truly custom.

### Installation

First, require the package using composer:
```ssh
composer require reinvanoyen/cmf
```

Add the service provider to the `providers` key in your `config/app.php`:

```php
'providers' => [
    ...
    \ReinVanOyen\Cmf\CmfServiceProvider::class,
];
```

Next, run the `cmf:install` command. This will essentially publish assets, config-files, 
migrations and other needed files.
```ssh
php artisan cmf:install
```

The install command has also published a application-specific service provider. Register it 
in your `config/app.php` file, like so:

```php
'providers' => [
    ...
    App\Providers\CmfServiceProvider::class,
];
```

Migrate your application.
```ssh
php artisan migration
```

Create a user.
```ssh
php artisan cmf:user
```
This command will ask for a name for your user, an email address and a password.

Once the user is created, you're ready to start building!

### Build a basic CRUD module

This section assumes you have already created the 
needed migration and model for your database entries.

Next you'll have to create a meta file. This is the file that 
describes how the software should interpret your entry.

The package provides an easy-to-use command to create your meta file. 
If you want to make a CRUD module for your "Project" model, all 
you have to do is run the following:
```ssh
php artisan cmf:meta Project
```
A new meta file for this model will be created under `App/Cmf/Meta`. To change 
this location, change the `meta_namespace` option in your `config/cmf.php` file.

Now that your meta file has been created, run the following command to generate your basic module:
```ssh
php artisan cmf:module Project
```
A new module file will be created under `App/Cmf/Modules`. To change this location, 
change the `modules_namespace` option in your `config/cmf.php` file.

All that's left to do, is to register your module in the application-specific service provider. 
Add the module to your `App\Providers\CmfServiceProvider.php`, like so:

```php
public function modules(): array
{
    return [
        new \App\Cmf\Modules\ProjectModule(),
    ];
}
```

Log in to your CMF backend panel (/admin), you should see your newly created module in the 
left-hand navigation panel.
