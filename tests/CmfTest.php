<?php

namespace ReinVanOyen\Cmf\Tests\Component;

use ReinVanOyen\Cmf\Cmf;
use ReinVanOyen\Cmf\Module;
use ReinVanOyen\Cmf\Tests\TestCase;

class CmfTest extends TestCase
{
    public function testConfiguation()
    {
        // Assert if the title is injected to the CMF instance
        $this->assertEquals('Test cmf', app(Cmf::class)->getTitle());

        // Change the title
        app(Cmf::class)->setTitle('New title');

        // Assert the title corresponds to the new title
        $this->assertEquals('New title', app(Cmf::class)->getTitle());
    }

    public function testIfApiIsUnauthorized()
    {
        $response = $this->withExceptionHandling()
            ->get('/cmf/api/modules');

        $response->assertStatus(401);
    }

    public function testModulesCount()
    {
        $this->assertCount(1, app(Cmf::class)->getModules());
    }

    public function testIfAllModulesAreInstantiated()
    {
        $modules = app(Cmf::class)->getModules();

        foreach ($modules as $module) {
            $this->assertInstanceOf(Module::class, $module);
            $this->assertIsString($module->id());
        }
    }

    public function testIfModulesAreCorrectlyStored()
    {
        $modules = app(Cmf::class)->getModules();

        foreach ($modules as $module) {
            $this->assertEquals(
                $module,
                app(Cmf::class)->getModule($module->id())
            );
        }
    }
}
