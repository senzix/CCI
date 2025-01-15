<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grant_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('grants', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('reference_number')->unique();
            $table->foreignId('category_id')->constrained('grant_categories')->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->date('start_date');
            $table->date('end_date');
            $table->string('funding_agency');
            $table->string('status'); // draft, submitted, approved, rejected, active, completed
            $table->text('description')->nullable();
            $table->text('objectives')->nullable();
            $table->text('requirements')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->decimal('amount_received', 15, 2)->default(0);
            $table->decimal('amount_spent', 15, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('grant_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grant_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('file_path');
            $table->string('type'); // proposal, report, contract, etc.
            $table->timestamps();
        });

        Schema::create('grant_expenditures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grant_id')->constrained()->onDelete('cascade');
            $table->string('description');
            $table->decimal('amount', 15, 2);
            $table->date('date');
            $table->string('category');
            $table->string('receipt_number')->nullable();
            $table->string('receipt_file')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grant_expenditures');
        Schema::dropIfExists('grant_documents');
        Schema::dropIfExists('grants');
        Schema::dropIfExists('grant_categories');
    }
}; 