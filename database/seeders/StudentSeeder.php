<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\StudentClass;
use App\Models\StudentClassAssignment;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $classes = StudentClass::all();
        $specialNeeds = ['Autism', 'ADHD', 'Dyslexia', 'Physical', null];
        $statuses = ['active', 'pending', 'archived'];
        $currentYear = date('Y');

        foreach (range(1, 50) as $index) {
            $registrationNumber = 'STU' . $currentYear . str_pad($index, 4, '0', STR_PAD_LEFT);
            
            $student = Student::create([
                'name' => $faker->name,
                'registration_number' => $registrationNumber,
                'photo_path' => null,
                'student_class_id' => $faker->randomElement($classes)->id,
                'special_needs_category' => $faker->randomElement($specialNeeds),
                'special_requirements' => $faker->optional()->paragraph,
                'status' => $faker->randomElement($statuses),
                'date_of_birth' => $faker->date('Y-m-d', '-5 years'),
                'guardian_name' => $faker->name,
                'guardian_contact' => $faker->phoneNumber,
                'guardian_email' => $faker->email,
            ]);

            // Create class assignment
            StudentClassAssignment::create([
                'student_id' => $student->id,
                'student_class_id' => $faker->randomElement($classes)->id,
                'start_date' => now(),
                'end_date' => null,
            ]);
        }
    }
} 