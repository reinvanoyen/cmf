<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMediaFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('media_files', function (Blueprint $table) {

            $table->bigIncrements('id');
            $table->timestamps();

            $table->string('name');
            $table->string('filename');
            $table->string('disk');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size');

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
        Schema::dropIfExists('media_files');
    }
}
