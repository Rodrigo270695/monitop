<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard')->middleware('permission:view_dashboard');

    // Role management routes (admin only)
    Route::middleware(['permission:view_roles'])->group(function () {
    Route::get('roles', [App\Http\Controllers\RoleController::class, 'index'])->name('roles.index');
    Route::post('roles', [App\Http\Controllers\RoleController::class, 'store'])->name('roles.store');
    Route::put('roles/{role}', [App\Http\Controllers\RoleController::class, 'update'])->name('roles.update');
    Route::delete('roles/{role}', [App\Http\Controllers\RoleController::class, 'deactivate'])->name('roles.deactivate');
    Route::patch('roles/{role}/activate', [App\Http\Controllers\RoleController::class, 'activate'])->name('roles.activate');
    Route::get('roles/{role}', [App\Http\Controllers\RoleController::class, 'show'])->name('roles.show');
});
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
