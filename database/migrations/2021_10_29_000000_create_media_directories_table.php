<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMediaDirectoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('media_directories', function (Blueprint $table) {

            $table->bigIncrements('id');
            $table->timestamps();

            $table->string('name');

            $table->bigInteger('media_directory_id')->unsigned()->nullable();
            $table->foreign('media_directory_id')
                ->references('id')
                ->on('media_directories');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('media_directories');
    }
}
