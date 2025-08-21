<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'Administrador',
            'Editor',
            'Moderador',
            'Usuario',
            'Invitado',
            'Supervisor',
            'Analista',
            'Desarrollador',
            'Tester',
            'Manager',
            'Coordinador',
            'Especialista',
            'Consultor',
            'Asistente',
            'Director',
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web',
            ]);
        }

        $this->command->info('✅ Roles creados exitosamente: ' . count($roles));
    }
}

