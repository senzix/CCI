import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import PayrollList from './Components/PayrollList';
import PayrollForm from './Components/PayrollForm';
import PayrollPeriodManager from './Components/PayrollPeriodManager';
import PayrollStats from './Components/PayrollStats';
import { FaMoneyBillWave, FaClock } from 'react-icons/fa';

export default function Index({ payrolls, employees, payrollPeriods, stats }) {
    const [isPayrollFormOpen, setIsPayrollFormOpen] = useState(false);
    const [isPeriodManagerOpen, setIsPeriodManagerOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(payrollPeriods[0]?.id);
    const [editingRecord, setEditingRecord] = useState(null);

    const handlePeriodChange = (e) => {
        const periodId = e.target.value;
        setSelectedPeriod(periodId);
        router.get(route('payroll.index'), { period: periodId }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Payroll Management
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage payroll records and periods
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setIsPeriodManagerOpen(true)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <FaClock className="mr-1.5 h-4 w-4" />
                            Manage Periods
                        </button>
                        <button
                            onClick={() => setIsPayrollFormOpen(true)}
                            className="inline-flex items-center px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-sm"
                        >
                            <FaMoneyBillWave className="mr-1.5 h-4 w-4" />
                            Generate Payroll
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Payroll Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <PayrollStats stats={stats} />

                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <select
                                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    value={selectedPeriod}
                                    onChange={handlePeriodChange}
                                >
                                    {payrollPeriods.map((period) => (
                                        <option key={period.id} value={period.id}>
                                            {period.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <PayrollList
                                payrolls={payrolls}
                                onEdit={(record) => {
                                    setEditingRecord(record);
                                    setIsPayrollFormOpen(true);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <PayrollForm
                isOpen={isPayrollFormOpen}
                onClose={() => {
                    setIsPayrollFormOpen(false);
                    setEditingRecord(null);
                }}
                employees={employees}
                payrollPeriod={payrollPeriods.find(p => p.id === selectedPeriod)}
                editingRecord={editingRecord}
            />

            <PayrollPeriodManager
                isOpen={isPeriodManagerOpen}
                onClose={() => setIsPeriodManagerOpen(false)}
                periods={payrollPeriods}
            />
        </AuthenticatedLayout>
    );
} 