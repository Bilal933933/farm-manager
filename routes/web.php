<?php

use App\Domains\Crops\Http\Controllers\CropController;
use App\Domains\Lands\Http\Controllers\CostController;
use App\Domains\Lands\Http\Controllers\HarvestController;
use App\Domains\Lands\Http\Controllers\LandController;
use App\Domains\Ledger\Http\Controllers\LedgerController;
use App\Domains\Parties\Http\Controllers\PartyController;
use App\Domains\Payments\Http\Controllers\PaymentController;
use App\Domains\Products\Http\Controllers\ProductController;
use App\Domains\Purchases\Http\Controllers\PurchaseController;
use App\Domains\Sales\Http\Controllers\SaleController;
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
    Route::get('lands/{land}/seasons/{season}', [LandController::class, 'showSeason'])->name('lands.seasons.show');
    Route::put('lands/seasons/{season}', [LandController::class, 'updateSeason'])->name('lands.seasons.update');
    Route::delete('lands/seasons/{season}', [LandController::class, 'destroySeason'])->name('lands.seasons.destroy');

    Route::post('lands/seasons/{season}/start', [LandController::class, 'startSeason'])->name('lands.seasons.start');
    Route::post('lands/seasons/{season}/begin-harvest', [LandController::class, 'beginHarvest'])->name('lands.seasons.begin-harvest');
    Route::post('lands/seasons/{season}/complete', [LandController::class, 'completeSeason'])->name('lands.seasons.complete');
    Route::post('lands/seasons/{season}/cancel', [LandController::class, 'cancelSeason'])->name('lands.seasons.cancel');

    Route::resource('costs', CostController::class);

    Route::resource('parties', PartyController::class);

    Route::resource('products', ProductController::class);

    Route::get('stock', [StockMovementController::class, 'index'])->name('stock.index');
    Route::post('stock', [StockMovementController::class, 'store'])->name('stock.store');
    Route::post('stock/consume', [StockMovementController::class, 'consume'])->name('stock.consume');
    Route::post('stock/consume', [StockMovementController::class, 'consume'])->name('stock.consume');

    Route::resource('purchases', PurchaseController::class)->only(['index', 'create', 'store', 'show']);

    Route::resource('payments', PaymentController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update']);

    Route::get('ledger', [LedgerController::class, 'index'])->name('ledger.index');

    Route::resource('crops', CropController::class);

    Route::resource('harvests', HarvestController::class)->only(['store']);

    Route::resource('sales', SaleController::class)->only(['index', 'create', 'store', 'show']);
});

require __DIR__.'/settings.php';
