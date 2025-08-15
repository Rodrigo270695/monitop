<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class AssignRole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:assign-role {username} {role}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign a role to a user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $username = $this->argument('username');
        $roleName = $this->argument('role');

        $user = User::where('username', $username)->first();
        if (!$user) {
            $this->error("User with username '{$username}' not found.");
            return 1;
        }

        $role = Role::where('name', $roleName)->first();
        if (!$role) {
            $this->error("Role '{$roleName}' not found.");
            return 1;
        }

        $user->assignRole($role);
        $this->info("Role '{$roleName}' assigned to user '{$username}' successfully.");

        return 0;
    }
}
