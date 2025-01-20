<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_periods', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('start_date');
            $table->date('end_date');
            $table->date('payment_date');
            $table->string('status')->default('draft'); // draft, processing, completed
            $table->timestamps();
        });

        Schema::create('salary_components', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // allowance, deduction
            $table->boolean('is_taxable')->default(false);
            $table->boolean('is_fixed')->default(true);
            $table->decimal('amount', 10, 2)->nullable();
            $table->decimal('percentage', 5, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('payroll_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained();
            $table->foreignId('payroll_period_id')->constrained();
            $table->decimal('basic_salary', 10, 2);
            $table->decimal('gross_salary', 10, 2);
            $table->decimal('total_deductions', 10, 2);
            $table->decimal('net_salary', 10, 2);
            $table->json('allowances');
            $table->json('deductions');
            $table->string('payment_status')->default('pending'); // pending, paid
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_records');
        Schema::dropIfExists('salary_components');
        Schema::dropIfExists('payroll_periods');
    }
}; 