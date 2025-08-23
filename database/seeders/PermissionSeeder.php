<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear permisos para menús principales
        $menuPermissions = [
            'dashboard.view' => 'Ver Dashboard',
        ];

        // Crear permisos para submenús
        $submenuPermissions = [
            'roles.view' => 'Ver Gestión de Roles',
            'usuarios.view' => 'Ver Gestión de Usuarios',
        ];

        // Crear permisos para acciones específicas
        $actionPermissions = [
            'roles.create' => 'Crear Roles',
            'roles.edit' => 'Editar Roles',
            'roles.delete' => 'Eliminar Roles',
            'roles.assign-permissions' => 'Asignar Permisos a Roles',
            'usuarios.create' => 'Crear Usuarios',
            'usuarios.edit' => 'Editar Usuarios',
            'usuarios.delete' => 'Eliminar Usuarios',
            'usuarios.assign-roles' => 'Asignar Roles a Usuarios',
        ];

        // Combinar todos los permisos
        $allPermissions = array_merge($menuPermissions, $submenuPermissions, $actionPermissions);

        // Crear los permisos en la base de datos
        foreach ($allPermissions as $permission => $description) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // Asignar todos los permisos al rol Administrador
        $adminRole = Role::where('name', 'Administrador')->first();

        if ($adminRole) {
            $adminRole->givePermissionTo(array_keys($allPermissions));
            $this->command->info('✅ Todos los permisos asignados al rol Administrador');
        } else {
            $this->command->error('❌ No se encontró el rol Administrador');
        }

        $this->command->info('🎯 Permisos creados exitosamente:');
        $this->command->info('📋 Menús: ' . count($menuPermissions));
        $this->command->info('📁 Submenús: ' . count($submenuPermissions));
        $this->command->info('⚡ Acciones: ' . count($actionPermissions));
        $this->command->info('📊 Total: ' . count($allPermissions));
    }
}
