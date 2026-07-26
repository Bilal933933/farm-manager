<?php

use App\Domains\Lands\Http\Controllers\LandController;
use App\Domains\Parties\Http\Controllers\PartyController;
use App\Domains\Products\Http\Controllers\ProductController;
use App\Domains\Purchases\Http\Controllers\PurchaseController;
use App\Domains\StockMovements\Http\Controllers\StockMovementController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('lands', LandController::class);
    Route::post('lands/contracts', [LandController::class, 'storeContract'])->name('lands.contracts.store');
    Route::put('lands/contracts/{contract}', [LandController::class, 'updateContract'])->name('lands.contracts.update');
    Route::delete('lands/contracts/{contract}', [LandController::class, 'destroyContract'])->name('lands.contracts.destroy');

    Route::post('lands/seasons', [LandController::class, 'storeSeason'])->name('lands.seasons.store');
    Route::put('lands/seasons/{season}', [LandController::class, 'updateSeason'])->name('lands.seasons.update');
    Route::delete('lands/seasons/{season}', [LandController::class, 'destroySeason'])->name('lands.seasons.destroy');

    Route::resource('parties', PartyController::class);

    Route::resource('products', ProductController::class);

    Route::get('stock', [StockMovementController::class, 'index'])->name('stock.index');
    Route::post('stock', [StockMovementController::class, 'store'])->name('stock.store');

    Route::resource('purchases', PurchaseController::class)->only(['index', 'create', 'store', 'show']);
});

require __DIR__.'/settings.php';
