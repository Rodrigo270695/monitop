<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (! $request->user() || ! $request->user()->hasPermissionTo($permission)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }

    /**
     * Check if user has access to a module (view permission)
     */
    public static function hasModuleAccess(string $module): bool
    {
        $user = auth()->user();
        if (!$user) {
            return false;
        }

        // Check if user has view permission for the module
        return $user->hasPermissionTo("view_{$module}");
    }

    /**
     * Check if user has CRUD permissions for a module
     */
    public static function hasCrudPermissions(string $module, array $actions = ['create', 'edit', 'delete']): array
    {
        $user = auth()->user();
        if (!$user) {
            return [];
        }

        $permissions = [];
        foreach ($actions as $action) {
            $permissionName = "{$action}_{$module}";
            if ($action === 'delete') {
                $permissionName = "deactivate_{$module}"; // Use deactivate instead of delete
            }
            $permissions[$action] = $user->hasPermissionTo($permissionName);
        }

        return $permissions;
    }
}
