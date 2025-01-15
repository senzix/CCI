<?php

namespace App\Http\Controllers;

use App\Models\StudentClassAssignment;
use Illuminate\Http\Request;

class ClassAssignmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'student_class_id' => 'required|exists:student_classes,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        StudentClassAssignment::create($validated);

        return redirect()->back()->with('success', 'Class assignment created successfully.');
    }

    public function update(Request $request, StudentClassAssignment $classAssignment)
    {
        $validated = $request->validate([
            'student_class_id' => 'required|exists:student_classes,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $classAssignment->update($validated);

        return redirect()->back()->with('success', 'Class assignment updated successfully.');
    }

    public function destroy(StudentClassAssignment $classAssignment)
    {
        $classAssignment->delete();
        
        return redirect()->back()->with('success', 'Class assignment deleted successfully.');
    }
}