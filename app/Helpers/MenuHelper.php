<?php

namespace App\Helpers;

class MenuHelper
{
    /**
     * Get main navigation items based on user permissions
     */
    public static function getMainNavItems(): array
    {
        $items = [];

        // Dashboard - always available if user is authenticated
        if (PermissionHelper::hasModuleAccess('dashboard')) {
            $items[] = [
                'title' => 'Dashboard',
                'href' => '/dashboard',
                'icon' => 'LayoutGrid',
            ];
        }

        // Usuario module - check if user has any user-related permissions
        if (PermissionHelper::hasModuleAccess('roles')) {
            $userChildren = [];

            // Add Gestionar Rol if user has roles permissions
            if (PermissionHelper::hasModuleAccess('roles')) {
                $userChildren[] = [
                    'title' => 'Gestionar Rol',
                    'href' => '/roles',
                    'icon' => 'Shield',
                ];
            }

            // Only add Usuario menu if it has children
            if (!empty($userChildren)) {
                $items[] = [
                    'title' => 'Usuario',
                    'href' => '#',
                    'icon' => 'Users',
                    'children' => $userChildren,
                ];
            }
        }

        return $items;
    }

    /**
     * Check if a menu item should be visible based on permissions
     */
    public static function shouldShowMenuItem(string $module): bool
    {
        return PermissionHelper::hasModuleAccess($module);
    }

    /**
     * Get available actions for a module
     */
    public static function getModuleActions(string $module): array
    {
        return PermissionHelper::getModuleCrudPermissions($module);
    }
}
