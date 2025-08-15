<?php

namespace App\Http\Controllers;

use App\Http\Requests\Role\RoleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search', '');
        $perPage = $request->get('per_page', 10);

        $query = Role::with('permissions');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhereHas('permissions', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
        }

        // Mostrar todos los roles (activos e inactivos)
        // $query->where('active', true);

        $roles = $query->paginate($perPage);
        $permissions = Permission::all();

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'permissions' => $permissions,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web',
            'active' => true,
        ]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->back()->with('success', 'Rol creado exitosamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, Role $role)
    {
        $role->update([
            'name' => $request->name,
        ]);

        // Si se envían permisos, sincronizarlos
        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->back()->with('success', 'Rol actualizado exitosamente.');
    }

        /**
     * Deactivate the specified resource.
     */
    public function deactivate(Role $role)
    {
        $role->update(['active' => false]);

        return redirect()->back()->with('success', 'Rol desactivado exitosamente.');
    }

    /**
     * Activate the specified resource.
     */
    public function activate(Role $role)
    {
        $role->update(['active' => true]);

        return redirect()->back()->with('success', 'Rol activado exitosamente.');
    }

    /**
     * Get role details for editing
     */
    public function show(Role $role)
    {
        $role->load('permissions');
        $permissions = Permission::all();

        return response()->json([
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }
}
