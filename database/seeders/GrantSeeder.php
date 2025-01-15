<?php

namespace Database\Seeders;

use App\Models\Grant;
use App\Models\GrantCategory;
use Illuminate\Database\Seeder;

class GrantSeeder extends Seeder
{
    public function run(): void
    {
        // Create grant categories
        $categories = [
            ['name' => 'Research', 'description' => 'Research and development grants'],
            ['name' => 'Infrastructure', 'description' => 'Infrastructure development grants'],
            ['name' => 'Education', 'description' => 'Educational program grants'],
            ['name' => 'Community', 'description' => 'Community development grants'],
        ];

        foreach ($categories as $category) {
            GrantCategory::create($category);
        }

        // Create sample grants
        $grants = [
            [
                'title' => 'Advanced Research Project',
                'reference_number' => 'GR-2024-001',
                'category_id' => 1,
                'amount' => 150000.00,
                'start_date' => '2024-02-01',
                'end_date' => '2025-01-31',
                'funding_agency' => 'National Science Foundation',
                'status' => 'active',
                'description' => 'Research project focusing on innovative technologies',
                'objectives' => 'Develop new methodologies and technologies',
                'contact_person' => 'Dr. John Smith',
                'contact_email' => 'john.smith@example.com',
                'contact_phone' => '123-456-7890',
                'amount_received' => 75000.00,
                'amount_spent' => 25000.00,
            ],
            [
                'title' => 'Campus Infrastructure Upgrade',
                'reference_number' => 'GR-2024-002',
                'category_id' => 2,
                'amount' => 500000.00,
                'start_date' => '2024-03-01',
                'end_date' => '2024-12-31',
                'funding_agency' => 'Department of Education',
                'status' => 'approved',
                'description' => 'Campus-wide infrastructure improvement project',
                'objectives' => 'Upgrade facilities and improve accessibility',
                'contact_person' => 'Jane Doe',
                'contact_email' => 'jane.doe@example.com',
                'contact_phone' => '987-654-3210',
                'amount_received' => 250000.00,
                'amount_spent' => 100000.00,
            ],
            [
                'title' => 'Community Outreach Program',
                'reference_number' => 'GR-2024-003',
                'category_id' => 4,
                'amount' => 75000.00,
                'start_date' => '2024-01-15',
                'end_date' => '2024-12-15',
                'funding_agency' => 'Community Foundation',
                'status' => 'active',
                'description' => 'Educational outreach program for local communities',
                'contact_person' => 'Robert Johnson',
                'contact_email' => 'robert.j@example.com',
                'amount_received' => 50000.00,
                'amount_spent' => 20000.00,
            ],
        ];

        foreach ($grants as $grant) {
            Grant::create($grant);
        }
    }
} 