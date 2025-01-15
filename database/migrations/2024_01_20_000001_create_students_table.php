<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // regular, special_ed
            $table->integer('capacity');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('registration_number')->unique();
            $table->string('photo_path')->nullable();
            $table->foreignId('student_class_id')->nullable()->constrained('student_classes')->nullOnDelete();
            $table->string('special_needs_category')->nullable();
            $table->text('special_requirements')->nullable();
            $table->string('status')->default('active');
            $table->date('date_of_birth');
            $table->string('guardian_name');
            $table->string('guardian_contact');
            $table->string('guardian_email')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('student_class_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_class_id')->constrained()->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_class_assignments');
        Schema::dropIfExists('student_classes');
        Schema::dropIfExists('students');
    }
}; 