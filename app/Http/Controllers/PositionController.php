<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'position_code' => 'required|string|max:10|unique:positions,code',
            'base_salary' => 'required|numeric|min:0',
            'department_id' => 'required|exists:departments,id'
        ]);

        // Map position_code to code field
        $validated['code'] = $validated['position_code'];
        unset($validated['position_code']);

        Position::create($validated);

        return redirect()->back()->with('success', 'Position created successfully.');
    }

    public function destroy(Position $position)
    {
        if ($position->employees()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete position with active employees.');
        }

        $position->delete();
        return redirect()->back()->with('success', 'Position deleted successfully.');
    }
} 