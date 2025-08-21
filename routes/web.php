<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard')->middleware('auth');

    // Users Management
    Route::get('users', function () {
        return Inertia::render('users/index');
    })->name('users.index')->middleware('auth');

    // Roles Management
    Route::middleware(['auth'])->group(function () {
        // Rutas que requieren ver roles
        Route::get('roles', [\App\Http\Controllers\RoleController::class, 'index'])->name('roles.index');

        // Rutas que requieren crear roles
        Route::get('roles/create', [\App\Http\Controllers\RoleController::class, 'create'])->name('roles.create');
        Route::post('roles', [\App\Http\Controllers\RoleController::class, 'store'])->name('roles.store');

        // Rutas que requieren editar roles
        Route::get('roles/{role}/edit', [\App\Http\Controllers\RoleController::class, 'edit'])->name('roles.edit');
        Route::put('roles/{role}', [\App\Http\Controllers\RoleController::class, 'update'])->name('roles.update');

        // Rutas que requieren eliminar roles
        Route::delete('roles/{role}', [\App\Http\Controllers\RoleController::class, 'destroy'])->name('roles.destroy');

        // Rutas que requieren asignar permisos
        Route::post('roles/{role}/permissions', [\App\Http\Controllers\RoleController::class, 'updatePermissions'])->name('roles.permissions.update');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
