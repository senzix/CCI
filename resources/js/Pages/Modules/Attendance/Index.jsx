import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AttendanceTable from './Components/AttendanceTable';
import AttendanceForm from './Components/AttendanceForm';
import LeaveRequestManager from './Components/LeaveRequestManager';
import AttendanceStats from './Components/AttendanceStats';
import { FaUserClock, FaCalendarAlt } from 'react-icons/fa';

export default function Index({ attendance, employees, leaveRequests, leaveTypes, stats }) {
    const [isAttendanceFormOpen, setIsAttendanceFormOpen] = useState(false);
    const [isLeaveManagerOpen, setIsLeaveManagerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editingRecord, setEditingRecord] = useState(null);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Attendance Management
                    </h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setIsLeaveManagerOpen(true)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <FaCalendarAlt className="mr-2 h-4 w-4" />
                            Leave Requests
                        </button>
                        <button
                            onClick={() => setIsAttendanceFormOpen(true)}
                            className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
                        >
                            <FaUserClock className="mr-2 h-4 w-4" />
                            Record Attendance
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Attendance Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <AttendanceStats stats={stats} />

                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="date"
                                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        value={selectedDate.toISOString().split('T')[0]}
                                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                    />
                                </div>
                            </div>

                            <AttendanceTable
                                attendance={attendance}
                                onEdit={(record) => {
                                    setEditingRecord(record);
                                    setIsAttendanceFormOpen(true);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <AttendanceForm
                isOpen={isAttendanceFormOpen}
                onClose={() => {
                    setIsAttendanceFormOpen(false);
                    setEditingRecord(null);
                }}
                employees={employees}
                selectedDate={selectedDate}
            />

            <LeaveRequestManager
                isOpen={isLeaveManagerOpen}
                onClose={() => setIsLeaveManagerOpen(false)}
                leaveRequests={leaveRequests}
                employees={employees}
                leaveTypes={leaveTypes}
            />
        </AuthenticatedLayout>
    );
} 