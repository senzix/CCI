<?php

namespace App\Http\Controllers;

use App\Models\GrantCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GrantCategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:grant_categories',
            'description' => 'nullable|string'
        ]);

        GrantCategory::create($validated);

        return redirect()->back()->with('success', 'Category created successfully');
    }

    public function update(Request $request, GrantCategory $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('grant_categories')->ignore($category)],
            'description' => 'nullable|string'
        ]);

        $category->update($validated);

        return redirect()->back()->with('success', 'Category updated successfully');
    }

    public function destroy(GrantCategory $category)
    {
        // Check if category has associated grants
        if ($category->grants()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete category with associated grants');
        }

        $category->delete();

        return redirect()->back()->with('success', 'Category deleted successfully');
    }
} 