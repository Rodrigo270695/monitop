<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Verificar permiso para ver roles
        if (!auth()->user()->hasPermissionTo('roles.view') && !auth()->user()->hasRole('Administrador')) {
            return redirect()->back()->with('error', 'No tienes permisos para ver roles.');
        }

        $perPage = request('per_page', 10);
        $perPage = in_array($perPage, [5, 10, 25, 50, 100]) ? $perPage : 10;

        $roles = Role::withCount('users')
            ->with('permissions')
            ->orderBy('name')
            ->paginate($perPage);

        return Inertia::render('roles/index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Verificar permiso para crear roles
        if (!auth()->user()->hasPermissionTo('roles.create') && !auth()->user()->hasRole('Administrador')) {
            return redirect()->back()->with('error', 'No tienes permisos para crear roles.');
        }

        return response()->json(['success' => true]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        // Verificar permiso para crear roles
        if (!auth()->user()->hasPermissionTo('roles.create') && !auth()->user()->hasRole('Administrador')) {
            return redirect()->back()->with('error', 'No tienes permisos para crear roles.');
        }

        $role = Role::create($request->validated());

        return redirect()->back()->with('success', 'Rol creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $role->load('users');

        return Inertia::render('roles/show', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        return response()->json([
            'success' => true,
            'role' => $role,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, Role $role)
    {
        // Verificar permiso para editar roles
        if (!auth()->user()->hasPermissionTo('roles.edit') && !auth()->user()->hasRole('Administrador')) {
            return redirect()->back()->with('error', 'No tienes permisos para editar roles.');
        }

        $role->update($request->validated());

        return redirect()->back()->with('success', 'Rol actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        // Verificar permiso para eliminar roles
        if (!auth()->user()->hasPermissionTo('roles.delete') && !auth()->user()->hasRole('Administrador')) {
            return redirect()->back()->with('error', 'No tienes permisos para eliminar roles.');
        }

        if ($role->users()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar un rol que tiene usuarios asignados.');
        }

        $role->delete();

        return redirect()->back()->with('success', 'Rol eliminado exitosamente.');
    }

    /**
     * Update permissions for the specified role.
     */
    public function updatePermissions(Request $request, Role $role)
    {
        // Verificar permiso para asignar permisos
        if (!auth()->user()->hasPermissionTo('roles.assign-permissions') && !auth()->user()->hasRole('Administrador')) {
            return redirect()->back()->with('error', 'No tienes permisos para asignar permisos.');
        }

        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'string|exists:permissions,name'
        ]);

                try {
            // Sincronizar permisos del rol
            $role->syncPermissions($request->permissions);

            // Para peticiones Inertia, redirigir con mensaje de éxito
            return redirect()->route('roles.index')->with('success', 'Permisos actualizados exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al actualizar los permisos: ' . $e->getMessage());
        }
    }
}
