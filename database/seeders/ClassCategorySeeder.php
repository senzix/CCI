<?php

namespace Database\Seeders;

use App\Models\StudentClass;
use Illuminate\Database\Seeder;

class ClassCategorySeeder extends Seeder
{
    public function run(): void
    {
        $classes = [
            [
                'name' => 'Primary 1',
                'type' => 'regular',
                'capacity' => 30,
                'description' => 'First year primary education'
            ],
            [
                'name' => 'Primary 2',
                'type' => 'regular',
                'capacity' => 30,
                'description' => 'Second year primary education'
            ],
            [
                'name' => 'Secondary 1',
                'type' => 'regular',
                'capacity' => 35,
                'description' => 'First year secondary education'
            ],
            [
                'name' => 'Special Ed A',
                'type' => 'special_ed',
                'capacity' => 15,
                'description' => 'Special education class for students with learning disabilities'
            ],
        ];

        foreach ($classes as $class) {
            StudentClass::create($class);
        }
    }
} 