<?php

namespace App\Http\Controllers;

use App\Models\DocumentCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DocumentCategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:document_categories,name',
            'description' => 'nullable|string',
        ]);

        DocumentCategory::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'],
        ]);

        return back()->with('success', 'Category created successfully.');
    }

    public function update(Request $request, DocumentCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:document_categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'],
        ]);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(DocumentCategory $category)
    {
        if ($category->documents()->exists()) {
            return back()->with('error', 'Cannot delete category with associated documents.');
        }

        $category->delete();
        return back()->with('success', 'Category deleted successfully.');
    }
} 