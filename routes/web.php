<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('lands', \App\Domains\Lands\Http\Controllers\LandController::class);
    Route::post('lands/contracts', [\App\Domains\Lands\Http\Controllers\LandController::class, 'storeContract'])->name('lands.contracts.store');
    Route::put('lands/contracts/{contract}', [\App\Domains\Lands\Http\Controllers\LandController::class, 'updateContract'])->name('lands.contracts.update');
    Route::delete('lands/contracts/{contract}', [\App\Domains\Lands\Http\Controllers\LandController::class, 'destroyContract'])->name('lands.contracts.destroy');

    Route::post('lands/seasons', [\App\Domains\Lands\Http\Controllers\LandController::class, 'storeSeason'])->name('lands.seasons.store');
    Route::put('lands/seasons/{season}', [\App\Domains\Lands\Http\Controllers\LandController::class, 'updateSeason'])->name('lands.seasons.update');
    Route::delete('lands/seasons/{season}', [\App\Domains\Lands\Http\Controllers\LandController::class, 'destroySeason'])->name('lands.seasons.destroy');

    Route::resource('parties', \App\Domains\Parties\Http\Controllers\PartyController::class);
});

require __DIR__.'/settings.php';
