<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class ListRolesPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permissions:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List all roles and permissions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== ROLES ===');
        $roles = Role::with('permissions')->get();

        foreach ($roles as $role) {
            $this->line("Role: {$role->name}");
            $permissions = $role->permissions->pluck('name')->toArray();
            if (!empty($permissions)) {
                $this->line("  Permissions: " . implode(', ', $permissions));
            } else {
                $this->line("  No permissions assigned");
            }
            $this->line('');
        }

        $this->info('=== PERMISSIONS ===');
        $permissions = Permission::all();
        foreach ($permissions as $permission) {
            $this->line("- {$permission->name}");
        }

        $this->info('=== USERS WITH ROLES ===');
        $users = \App\Models\User::with('roles')->get();
        foreach ($users as $user) {
            $roles = $user->roles->pluck('name')->toArray();
            $this->line("User: {$user->username} ({$user->email})");
            if (!empty($roles)) {
                $this->line("  Roles: " . implode(', ', $roles));
            } else {
                $this->line("  No roles assigned");
            }
            $this->line('');
        }
    }
}
