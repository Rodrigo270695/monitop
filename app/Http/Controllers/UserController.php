<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Verificar permiso para ver usuarios
        if (!auth()->user()->hasPermissionTo('usuarios.view') && !auth()->user()->hasRole('Administrador')) {
            return redirect()->back()->with('error', 'No tienes permisos para ver usuarios.');
        }

        $perPage = request('per_page', 10);
        $perPage = in_array($perPage, [5, 10, 25, 50, 100]) ? $perPage : 10;

        $users = User::withCount('roles')
            ->with('roles')
            ->orderBy('name')
            ->paginate($perPage);

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Verificar permiso para crear usuarios
        if (!auth()->user()->hasPermissionTo('usuarios.create') && !auth()->user()->hasRole('Administrador')) {
            return redirect()->back()->with('error', 'No tienes permisos para crear usuarios.');
        }

        return response()->json(['success' => true]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        // Verificar permiso para crear usuarios
        if (!auth()->user()->hasPermissionTo('usuarios.create') && !auth()->user()->hasRole('Administrador')) {
            return redirect()->back()->with('error', 'No tienes permisos para crear usuarios.');
        }

        $userData = $request->validated();
        $userData['password'] = Hash::make($userData['password']);

        $user = User::create($userData);

        return redirect()->back()->with('success', 'Usuario creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load('roles');

        return Inertia::render('users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return response()->json([
            'success' => true,
            'user' => $user->load('roles'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        // Verificar permiso para editar usuarios
        if (!auth()->user()->hasPermissionTo('usuarios.edit') && !auth()->user()->hasRole('Administrador')) {
            return redirect()->back()->with('error', 'No tienes permisos para editar usuarios.');
        }

        $userData = $request->validated();

        // Si se proporciona una nueva contraseña, hashearla
        if (isset($userData['password']) && !empty($userData['password'])) {
            $userData['password'] = Hash::make($userData['password']);
        } else {
            unset($userData['password']);
        }

        $user->update($userData);

        return redirect()->back()->with('success', 'Usuario actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Verificar permiso para eliminar usuarios
        if (!auth()->user()->hasPermissionTo('usuarios.delete') && !auth()->user()->hasRole('Administrador')) {
            return redirect()->back()->with('error', 'No tienes permisos para eliminar usuarios.');
        }

        // No permitir eliminar el usuario actual
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Usuario eliminado exitosamente.');
    }

    /**
     * Update roles for the specified user.
     */
    public function updateRoles(Request $request, User $user)
    {
        // Verificar permiso para asignar roles
        if (!auth()->user()->hasPermissionTo('usuarios.assign-roles') && !auth()->user()->hasRole('Administrador')) {
            return redirect()->back()->with('error', 'No tienes permisos para asignar roles.');
        }

        $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'string|exists:roles,name'
        ]);

        try {
            // Sincronizar roles del usuario
            $user->syncRoles($request->roles);

            return redirect()->route('users.index')->with('success', 'Roles actualizados exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al actualizar los roles: ' . $e->getMessage());
        }
    }
}
