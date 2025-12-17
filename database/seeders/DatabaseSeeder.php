<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Session;
use App\Models\Setting;
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
            'email' => 'admin@EMBA.edu',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create initial sessions (seasonal format: Summer/Winter YYYY-YY)
        Session::create([
            'session_name' => '2025-26',
            'season' => 'winter',
            'year_start' => 2025,
            'year_end' => 2026,
            'is_active' => true,
        ]);

        Session::create([
            'session_name' => '2025-26',
            'season' => 'summer',
            'year_start' => 2025,
            'year_end' => 2026,
            'is_active' => false,
        ]);

        Session::create([
            'session_name' => '2024-25',
            'season' => 'winter',
            'year_start' => 2024,
            'year_end' => 2025,
            'is_active' => false,
        ]);

        // Seed authentication toggle setting
        Setting::create([
            'key' => 'require_applicant_auth',
            'value' => 'true',
            'type' => 'boolean',
            'group' => 'application',
            'label' => 'Require Applicant Authentication',
        ]);
    }
}
