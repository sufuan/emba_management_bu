<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Session;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@emba.edu',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create initial sessions (one admission per year, format: 2025-26)
        Session::create([
            'session_name' => '2025-26',
            'year_start' => 2025,
            'year_end' => 2026,
            'is_active' => true,
        ]);

        Session::create([
            'session_name' => '2024-25',
            'year_start' => 2024,
            'year_end' => 2025,
            'is_active' => false,
        ]);
    }
}
