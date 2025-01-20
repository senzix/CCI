<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payslip</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .total { margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>PAYSLIP</h1>
        <p>{{ $payroll->payroll_period->name }}</p>
    </div>

    <!-- Employee Information -->
    <div class="section">
        <h2>Employee Information</h2>
        <div class="grid">
            <div>
                <p><strong>Name:</strong> {{ $payroll->employee->first_name }} {{ $payroll->employee->last_name }}</p>
                <p><strong>Employee ID:</strong> {{ $payroll->employee->employee_id }}</p>
            </div>
            <div>
                <p><strong>Position:</strong> {{ $payroll->employee->position->name }}</p>
                <p><strong>Department:</strong> {{ $payroll->employee->department->name }}</p>
            </div>
        </div>
    </div>

    <!-- Salary Details -->
    <div class="section">
        <h2>Salary Breakdown</h2>
        <p><strong>Basic Salary:</strong> ₹{{ number_format($payroll->basic_salary, 2) }}</p>
        
        <!-- Allowances -->
        @if(count($allowances) > 0)
            <h3>Allowances</h3>
            @foreach($allowances as $allowance)
                <p>{{ $allowance->name }}: ₹{{ number_format($allowance->amount, 2) }}</p>
            @endforeach
        @endif

        <!-- Deductions -->
        @if(count($deductions) > 0)
            <h3>Deductions</h3>
            @foreach($deductions as $deduction)
                <p>{{ $deduction->name }}: -₹{{ number_format($deduction->amount, 2) }}</p>
            @endforeach
        @endif

        <!-- Totals -->
        <div class="total">
            <p><strong>Gross Salary:</strong> ₹{{ number_format($payroll->gross_salary, 2) }}</p>
            <p><strong>Total Deductions:</strong> -₹{{ number_format($payroll->total_deductions, 2) }}</p>
            <p><strong>Net Salary:</strong> ₹{{ number_format($payroll->net_salary, 2) }}</p>
        </div>
    </div>
</body>
</html> 