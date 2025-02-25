<?php

namespace Database\Factories;

use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    protected $model = Document::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence,
            'file_path' => 'documents/test.pdf',
            'file_name' => 'test.pdf',
            'file_type' => 'pdf',
            'file_size' => 1000,
            'description' => $this->faker->paragraph,
            'category_id' => 1,
            'status' => 'active',
            'documentable_type' => null,
            'documentable_id' => null,
        ];
    }
} 