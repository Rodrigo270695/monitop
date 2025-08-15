<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

                // Create permissions
        $permissions = [
            // Dashboard permissions
            'view_dashboard',

            // Role management permissions
            'view_roles',           // Ver menú y listar roles
            'create_roles',         // Crear roles
            'edit_roles',           // Editar roles
            'deactivate_roles',     // Desactivar roles
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'Administrador']);
        $adminRole->givePermissionTo(Permission::all());

        // Assign admin role to the admin user
        $adminUser = User::where('username', 'admin')->first();
        if ($adminUser) {
            $adminUser->assignRole('Administrador');
        }
    }
}
