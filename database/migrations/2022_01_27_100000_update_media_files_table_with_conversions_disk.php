<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateMediaFilesTableWithConversionsDisk extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('media_files', function (Blueprint $table) {
            $table->string('conversions_disk')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('media_files', function (Blueprint $table) {
            $table->dropColumn('conversions_disk');
        });
    }
}
