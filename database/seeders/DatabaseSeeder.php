<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            DocumentCategorySeeder::class,
            ClassCategorySeeder::class,
            StudentSeeder::class,
            GrantSeeder::class,
        ]);
    }
}
