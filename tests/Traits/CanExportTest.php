<?php

namespace ReinVanOyen\Cmf\Tests\Traits;

use ReinVanOyen\Cmf\Contracts\Exportable;
use ReinVanOyen\Cmf\Tests\TestCase;
use ReinVanOyen\Cmf\Traits\CanExport;

class CanExportTest extends TestCase
{
    private $exporter;

    public function setUp(): void
    {
        parent::setUp();

        $this->exporter = new Exporter();
    }

    public function testInitialValue()
    {
        // Constructor value test
        $json = json_encode($this->exporter);
        $this->assertJson($json);
        $array = json_decode($json, true);

        $this->assertEquals(1, $array['value']);
    }

    public function testUpdateValue()
    {
        $this->exporter->updateValue();
        $json = json_encode($this->exporter);
        $this->assertJson($json);
        $array = json_decode($json, true);

        $this->assertEquals(2, $array['value']);
    }

    public function testAddValue()
    {
        $this->exporter->addValue();
        $json = json_encode($this->exporter);
        $this->assertJson($json);
        $array = json_decode($json, true);

        $this->assertEquals(3, $array['Another value']);
    }

    public function testCount()
    {
        $json = json_encode($this->exporter);
        $this->assertJson($json);
        $array = json_decode($json, true);

        $keys = array_keys($array);

        $this->assertCount(2, $keys);

        // Add a value
        $this->exporter->addValue();

        $json = json_encode($this->exporter);
        $this->assertJson($json);
        $array = json_decode($json, true);

        $keys = array_keys($array);

        $this->assertCount(3, $keys);
    }
}

class Exporter implements Exportable, \JsonSerializable
{
    use CanExport;

    public function __construct()
    {
        $this->export('value', 1);
    }

    public function type(): string
    {
        return 'exporter';
    }

    public function updateValue()
    {
        $this->export('value', 2);
    }

    public function addValue()
    {
        $this->export('Another value', 3);
    }
}
