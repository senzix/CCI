<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\PayrollPeriod;
use App\Models\PayrollRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class PayrollController extends Controller
{
    public function index()
    {
        return Inertia::render('Modules/Payroll/Index', [
            'payrolls' => PayrollRecord::with(['employee', 'payrollPeriod'])->get(),
            'employees' => Employee::all(),
            'payrollPeriods' => PayrollPeriod::orderBy('start_date', 'desc')->get(),
            'stats' => [
                'total_payroll' => PayrollRecord::sum('net_salary'),
                'active_employees' => Employee::where('status', 'active')->count(),
                'current_period' => PayrollPeriod::where('start_date', '<=', now())
                    ->where('end_date', '>=', now())
                    ->first()?->name ?? 'No Active Period',
                'pending_payments' => PayrollRecord::where('payment_status', 'pending')->count()
            ]
        ]);
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'payroll_period_id' => 'required|exists:payroll_periods,id',
            'basic_salary' => 'required|numeric|min:0',
            'allowances' => 'array',
            'deductions' => 'array',
            'notes' => 'nullable|string'
        ]);

        $grossSalary = $validated['basic_salary'] + collect($validated['allowances'])->sum('amount');
        $totalDeductions = collect($validated['deductions'])->sum('amount');

        PayrollRecord::create([
            'employee_id' => $validated['employee_id'],
            'payroll_period_id' => $validated['payroll_period_id'],
            'basic_salary' => $validated['basic_salary'],
            'gross_salary' => $grossSalary,
            'total_deductions' => $totalDeductions,
            'net_salary' => $grossSalary - $totalDeductions,
            'allowances' => $validated['allowances'],
            'deductions' => $validated['deductions'],
            'payment_status' => 'pending'
        ]);

        return redirect()->back()->with('success', 'Payroll generated successfully.');
    }

    public function markPaid(PayrollRecord $payroll)
    {
        $payroll->update(['payment_status' => 'paid']);
        return redirect()->back()->with('success', 'Payroll marked as paid.');
    }

    public function download(PayrollRecord $payroll)
    {
        $payroll->load(['employee.position.department', 'payrollPeriod']);
        $pdf = Pdf::loadView('pdf.payslip', [
            'payroll' => $payroll,
            'allowances' => json_decode($payroll->allowances),
            'deductions' => json_decode($payroll->deductions)
        ]);
        
        return $pdf->download("payslip-{$payroll->employee->employee_id}-{$payroll->payroll_period->name}.pdf");
    }

    public function show(PayrollRecord $payroll)
    {
        return Inertia::render('Modules/Payroll/Show', [
            'payroll' => $payroll->load(['employee.position.department', 'payrollPeriod']),
            'allowances' => json_decode($payroll->allowances),
            'deductions' => json_decode($payroll->deductions)
        ]);
    }
} 