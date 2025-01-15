<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\StudentClass;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index()
    {
        return Inertia::render('Modules/StudentManagement/Index', [
            'students' => Student::query()
                ->with(['currentClass.class', 'class', 'classAssignments.class'])
                ->when(request('search'), function($query, $search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('registration_number', 'like', "%{$search}%");
                })
                ->when(request('class'), function($query, $class) {
                    if ($class !== 'all') {
                        $query->where('student_class_id', $class);
                    }
                })
                ->when(request('tab'), function($query, $tab) {
                    if ($tab === 'special-ed') {
                        $query->whereNotNull('special_needs_category');
                    } elseif ($tab !== 'all') {
                        $query->where('status', $tab);
                    }
                })
                ->paginate(10)
                ->withQueryString(),
            'filters' => request()->all(),
            'classes' => StudentClass::select('id', 'name', 'capacity', 'type')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => [
                'required',
                'string',
                'unique:students,registration_number',
                'regex:/^STU\d{8}$/' // Validates format STU20240001
            ],
            'photo' => 'nullable|image|max:1024',
            'student_class_id' => 'required|exists:student_classes,id',
            'special_needs_category' => 'nullable|string',
            'special_requirements' => 'nullable|string',
            'status' => 'required|string',
            'date_of_birth' => 'required|date',
            'guardian_name' => 'required|string',
            'guardian_contact' => 'required|string',
            'guardian_email' => 'nullable|email',
        ]);

        // Auto-generate registration number for new students
        $validated['registration_number'] = $this->generateRegistrationNumber();

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('student-photos', 'public');
            $validated['photo_path'] = $path;
        }

        $student = Student::create($validated);

        $student->classAssignments()->create([
            'student_class_id' => $validated['student_class_id'],
            'start_date' => now(),
        ]);

        return redirect()->back()->with('success', 'Student created successfully.');
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'registration_number' => [
                'required',
                'string',
                Rule::unique('students')->ignore($student->id),
                'regex:/^STU\d{8}$/' // Validates format STU20240001
            ],
            'photo' => 'nullable|image|max:1024',
            'student_class_id' => 'required|exists:student_classes,id',
            'special_needs_category' => 'nullable|string',
            'special_requirements' => 'nullable|string',
            'status' => 'required|string',
            'date_of_birth' => 'required|date',
            'guardian_name' => 'required|string',
            'guardian_contact' => 'required|string',
            'guardian_email' => 'nullable|email',
        ], [
            'registration_number.regex' => 'The registration number must be in the format STU followed by 8 digits (e.g., STU20240001)'
        ]);

        if ($request->hasFile('photo')) {
            if ($student->photo_path) {
                Storage::disk('public')->delete($student->photo_path);
            }
            $path = $request->file('photo')->store('student-photos', 'public');
            $validated['photo_path'] = $path;
        }

        $student->update($validated);

        $currentAssignment = $student->currentClass;
        if (!$currentAssignment || $currentAssignment->student_class_id != $validated['student_class_id']) {
            if ($currentAssignment) {
                $currentAssignment->update(['end_date' => now()]);
            }
            $student->classAssignments()->create([
                'student_class_id' => $validated['student_class_id'],
                'start_date' => now(),
            ]);
        }

        return redirect()->back()->with('success', 'Student updated successfully.');
    }

    public function destroy(Student $student)
    {
        if ($student->photo_path) {
            Storage::disk('public')->delete($student->photo_path);
        }

        $student->delete();
        return redirect()->back()->with('success', 'Student deleted successfully.');
    }

    public function show(Student $student)
    {
        return Inertia::render('Modules/StudentManagement/Show', [
            'student' => $student->load(['classAssignments' => function($query) {
                $query->orderBy('start_date', 'desc');
            }, 'classAssignments.class']),
            'classes' => StudentClass::select('id', 'name', 'capacity', 'type')->get()
        ]);
    }

    public function edit(Student $student)
    {
        return Inertia::render('Modules/StudentManagement/Edit', [
            'student' => $student->load('currentClass.class')
        ]);
    }

    public function generateRegistrationNumber()
    {
        $currentYear = date('Y');
        $prefix = 'STU';
        
        $latestStudent = Student::where('registration_number', 'like', $prefix . $currentYear . '%')
            ->orderBy('registration_number', 'desc')
            ->first();
        
        if (!$latestStudent) {
            $registrationNumber = $prefix . $currentYear . '0001';
        } else {
            $currentNumber = intval(substr($latestStudent->registration_number, -4));
            $nextNumber = $currentNumber + 1;
            
            if ($nextNumber > 9999) {
                $nextNumber = 10000;
            }
            
            $numberPart = $nextNumber < 10000 ? str_pad($nextNumber, 4, '0', STR_PAD_LEFT) : $nextNumber;
            $registrationNumber = $prefix . $currentYear . $numberPart;
        }
        
        return $registrationNumber;
    }
} 