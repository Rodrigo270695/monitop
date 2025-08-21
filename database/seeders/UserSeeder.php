<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Administrador',
                'email' => 'admin@monitop.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
            ]
        );

        User::updateOrCreate(
            ['username' => 'demo'],
            [
                'name' => 'Usuario Demo',
                'email' => 'demo@monitop.com',
                'email_verified_at' => now(),
                'password' => Hash::make('demo123'),
            ]
        );
    }
}
