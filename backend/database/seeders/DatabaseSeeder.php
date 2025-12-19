<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    // In backend/database/seeders/DatabaseSeeder.php
public function run()
{
    $this->call([
        CategorySeeder::class,
    ]);
}
}
