<?php

namespace ReinVanOyen\Cmf\Tests\Component;

use ReinVanOyen\Cmf\Facades\Cmf;
use ReinVanOyen\Cmf\Module;
use ReinVanOyen\Cmf\Tests\TestCase;

class CmfTest extends TestCase
{
    public function testIfApiIsUnauthorized()
    {
        $response = $this->withExceptionHandling()
            ->get('/cmf/api/modules');

        $response->assertStatus(401);
    }

    public function testModulesCount()
    {
        $this->assertCount(1, Cmf::getModules());
    }

    public function testIfAllModulesAreInstantiated()
    {
        $modules = Cmf::getModules();

        foreach ($modules as $module) {
            $this->assertInstanceOf(Module::class, $module);
            $this->assertIsString($module->id());
        }
    }

    public function testIfModulesAreCorrectlyStored()
    {
        $modules = Cmf::getModules();

        foreach ($modules as $module) {
            $this->assertEquals(
                $module,
                Cmf::getModule($module->id())
            );
        }
    }
}
