<?php

namespace ReinVanOyen\Cmf\Tests\Component;

use ReinVanOyen\Cmf\Module;
use ReinVanOyen\Cmf\ModuleRegistry;
use ReinVanOyen\Cmf\Tests\Fixtures\Modules\UserModule;
use ReinVanOyen\Cmf\Tests\TestCase;

class ModuleRegistryTest extends TestCase
{
    private function createModuleRegistry()
    {
        return app(ModuleRegistry::class);
    }

    public function testIfModuleGetsRegisteredAsRoot()
    {
        $sut = $this->createModuleRegistry();
        $sut->add(UserModule::class);

        $this->assertCount(1, $sut->all());
        $this->assertCount(1, $sut->root());
    }

    public function testIfModuleGetsRegisteredAsSubmodule()
    {
        $sut = $this->createModuleRegistry();
        $sut->add(UserModule::class, false);

        $this->assertCount(0, $sut->root());
        $this->assertCount(1, $sut->all());
    }

    public function testIfAddingInvalidModuleRegistersNothing()
    {
        $sut = $this->createModuleRegistry();

        $sut->add('AnInvalidModule');

        $this->assertCount(0, $sut->root());
        $this->assertCount(0, $sut->all());
    }

    public function testIfModuleGetsInstantiated()
    {
        $sut = $this->createModuleRegistry();
        $sut->add(UserModule::class);

        $this->assertInstanceOf(Module::class, $sut->get('users'));
    }

    public function testIfModuleGetsInstantiatedAsSubmodule()
    {
        $sut = $this->createModuleRegistry();
        $sut->add(UserModule::class, false);

        $this->assertInstanceOf(Module::class, $sut->get('users'));
    }

    public function testIfGettingUnknownModuleReturnsNull()
    {
        $sut = $this->createModuleRegistry();

        $this->assertNull($sut->get('media'));
        $this->assertNull($sut->get('products'));
        $this->assertNull($sut->get('users'));
    }

    public function testIfAddingModuleReturnsInstantiatedModule()
    {
        $sut = $this->createModuleRegistry();
        $module = $sut->add(UserModule::class);

        $this->assertInstanceOf(Module::class, $module);
    }

    public function testIfAddingInstantiatedModuleReturnsSameModule()
    {
        $sut = $this->createModuleRegistry();

        $userModule = new UserModule();
        $module = $sut->add($userModule);

        $this->assertEquals($module, $userModule);
    }

    public function testIfAddingInvalidModuleReturnsNull()
    {
        $sut = $this->createModuleRegistry();

        $module = $sut->add('AnInvalidModule');

        $this->assertNull($module);
    }
}
