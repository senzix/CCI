<?php

namespace Database\Seeders;

use App\Models\DocumentCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DocumentCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'General Documents',
            'Reports',
            'Contracts',
            'Proposals',
            'Financial Documents',
            'Legal Documents',
            'Technical Documents',
            'Other',
        ];

        foreach ($categories as $category) {
            DocumentCategory::create([
                'name' => $category,
                'slug' => Str::slug($category),
                'description' => "Category for {$category}",
            ]);
        }
    }
} 