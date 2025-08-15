<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;

class PermissionHelper
{
    /**
     * Check if the current user has a specific permission
     */
    public static function hasPermission(string $permission): bool
    {
        return Auth::check() && Auth::user()->hasPermissionTo($permission);
    }

    /**
     * Check if the current user has any of the given permissions
     */
    public static function hasAnyPermission(array $permissions): bool
    {
        return Auth::check() && Auth::user()->hasAnyPermission($permissions);
    }

    /**
     * Check if the current user has all of the given permissions
     */
    public static function hasAllPermissions(array $permissions): bool
    {
        return Auth::check() && Auth::user()->hasAllPermissions($permissions);
    }

    /**
     * Check if the current user has a specific role
     */
    public static function hasRole(string $role): bool
    {
        return Auth::check() && Auth::user()->hasRole($role);
    }

    /**
     * Check if the current user has any of the given roles
     */
    public static function hasAnyRole(array $roles): bool
    {
        return Auth::check() && Auth::user()->hasAnyRole($roles);
    }

    /**
     * Get all permissions for the current user
     */
    public static function getUserPermissions(): array
    {
        if (!Auth::check()) {
            return [];
        }

        return Auth::user()->getAllPermissions()->pluck('name')->toArray();
    }

    /**
     * Get all roles for the current user
     */
    public static function getUserRoles(): array
    {
        if (!Auth::check()) {
            return [];
        }

        return Auth::user()->getRoleNames()->toArray();
    }

    /**
     * Check if user has access to a module (view permission)
     * This is the main gate for showing menus and accessing modules
     */
    public static function hasModuleAccess(string $module): bool
    {
        return self::hasPermission("view_{$module}");
    }

    /**
     * Check if user has CRUD permissions for a module
     * Returns an array with permissions for each action
     */
    public static function getModuleCrudPermissions(string $module): array
    {
        if (!self::hasModuleAccess($module)) {
            return [
                'create' => false,
                'edit' => false,
                'delete' => false,
                'deactivate' => false,
            ];
        }

        return [
            'create' => self::hasPermission("create_{$module}"),
            'edit' => self::hasPermission("edit_{$module}"),
            'delete' => self::hasPermission("delete_{$module}"),
            'deactivate' => self::hasPermission("deactivate_{$module}"),
        ];
    }

    /**
     * Check if user can perform a specific action on a module
     * This automatically checks if user has module access first
     */
    public static function canPerformAction(string $module, string $action): bool
    {
        // First check if user has access to the module
        if (!self::hasModuleAccess($module)) {
            return false;
        }

        // Then check specific action permission
        $permissionName = "{$action}_{$module}";
        return self::hasPermission($permissionName);
    }

    /**
     * Get all available modules for the current user
     */
    public static function getAvailableModules(): array
    {
        $modules = ['dashboard', 'roles']; // Add more modules as needed

        $availableModules = [];
        foreach ($modules as $module) {
            if (self::hasModuleAccess($module)) {
                $availableModules[] = $module;
            }
        }

        return $availableModules;
    }
}
