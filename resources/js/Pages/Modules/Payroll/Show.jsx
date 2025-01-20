import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FaFileDownload, FaCheckCircle } from 'react-icons/fa';
import { router } from '@inertiajs/react';

export default function Show({ payroll, allowances, deductions }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Payroll Details
                    </h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => router.get(route('payroll.download', payroll.id))}
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                        >
                            <FaFileDownload className="mr-2 h-4 w-4" />
                            Download Payslip
                        </button>
                        {payroll.payment_status === 'pending' && (
                            <button
                                onClick={() => router.put(route('payroll.mark-paid', payroll.id))}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                            >
                                <FaCheckCircle className="mr-2 h-4 w-4" />
                                Mark as Paid
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Payroll Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Employee & Basic Info */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Employee Information</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Name:</span> {payroll.employee.first_name} {payroll.employee.last_name}</p>
                                    <p><span className="font-medium">Employee ID:</span> {payroll.employee.employee_id}</p>
                                    <p><span className="font-medium">Position:</span> {payroll.employee.position?.name}</p>
                                    <p><span className="font-medium">Department:</span> {payroll.employee.department?.name}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Payroll Period</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Period:</span> {payroll.payroll_period.name}</p>
                                    <p><span className="font-medium">Start Date:</span> {payroll.payroll_period.start_date}</p>
                                    <p><span className="font-medium">End Date:</span> {payroll.payroll_period.end_date}</p>
                                    <p><span className="font-medium">Payment Date:</span> {payroll.payroll_period.payment_date}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Salary Breakdown */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Salary Breakdown</h3>
                        <div className="grid grid-cols-3 gap-8">
                            <div>
                                <h4 className="font-medium mb-2">Basic Pay</h4>
                                <p className="text-2xl font-semibold">{formatCurrency(payroll.basic_salary)}</p>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Allowances</h4>
                                <div className="space-y-1">
                                    {allowances.map((allowance, index) => (
                                        <div key={index} className="flex justify-between">
                                            <span>{allowance.name}</span>
                                            <span>{formatCurrency(allowance.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Deductions</h4>
                                <div className="space-y-1">
                                    {deductions.map((deduction, index) => (
                                        <div key={index} className="flex justify-between">
                                            <span>{deduction.name}</span>
                                            <span>-{formatCurrency(deduction.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="flex justify-between">
                                        <span className="font-medium">Gross Salary:</span>
                                        <span>{formatCurrency(payroll.gross_salary)}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="font-medium">Total Deductions:</span>
                                        <span>-{formatCurrency(payroll.total_deductions)}</span>
                                    </p>
                                    <p className="flex justify-between text-lg font-semibold mt-2">
                                        <span>Net Salary:</span>
                                        <span>{formatCurrency(payroll.net_salary)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 