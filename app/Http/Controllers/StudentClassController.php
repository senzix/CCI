<?php

namespace App\Http\Controllers;

use App\Models\StudentClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentClassController extends Controller
{
    public function index()
    {
        return Inertia::render('Modules/ClassManagement/Index', [
            'classes' => StudentClass::query()
                ->when(request('search'), function($query, $search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                })
                ->when(request('type') && request('type') !== 'all', function($query, $type) {
                    $query->where('type', $type);
                })
                ->paginate(10)
                ->withQueryString(),
            'filters' => [
                'search' => request('search', ''),
                'type' => request('type', 'all')
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:student_classes',
            'type' => 'required|string|in:regular,special_ed',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        StudentClass::create($validated);

        return redirect()->back()->with('success', 'Class created successfully.');
    }

    public function update(Request $request, StudentClass $class)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:student_classes,name,'.$class->id,
            'type' => 'required|string|in:regular,special_ed',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        $class->update($validated);

        return redirect()->back()->with('success', 'Class updated successfully.');
    }

    public function destroy(StudentClass $class)
    {
        $class->delete();
        return redirect()->back()->with('success', 'Class deleted successfully.');
    }

    public function getClasses()
    {
        return response()->json([
            'data' => StudentClass::select('id', 'name', 'capacity', 'available_seats')
                ->orderBy('name')
                ->get()
        ]);
    }
} 