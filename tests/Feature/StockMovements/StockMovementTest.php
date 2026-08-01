<?php

use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Products\Models\Product;
use App\Domains\StockMovements\Enums\MovementReason;
use App\Domains\StockMovements\Enums\MovementType;
use App\Domains\StockMovements\Models\StockMovement;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('index page renders', function () {
    StockMovement::factory()->count(3)->create();

    $this->get(route('stock.index'))
        ->assertInertia(fn ($page) => $page->component('StockMovements/Index'));
});

test('inbound stock movement can be stored', function () {
    $product = Product::factory()->create();

    $this->post(route('stock.store'), [
        'product_id' => $product->id,
        'type' => MovementType::In->value,
        'reason' => MovementReason::Purchase->value,
        'quantity' => 100,
        'movement_date' => '2025-06-01',
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('stock.index'));

    expect(StockMovement::where('product_id', $product->id)->exists())->toBeTrue();
});

test('product can be consumed for a season creating a stock movement and cost', function () {
    $product = Product::factory()->create(['category' => 'سماد']);
    $season = LandSeason::factory()->create();

    StockMovement::factory()->create([
        'product_id' => $product->id,
        'type' => MovementType::In->value,
        'reason' => MovementReason::Purchase->value,
        'quantity' => 100,
    ]);

    $this->post(route('stock.consume'), [
        'product_id' => $product->id,
        'land_season_id' => $season->id,
        'quantity' => 10,
        'unit_price' => 50,
        'date' => '2026-06-01',
    ])->assertSessionHasNoErrors();

    $outMovement = StockMovement::where('product_id', $product->id)
        ->where('type', MovementType::Out->value)
        ->first();

    expect($outMovement)->not->toBeNull()
        ->and((float) $outMovement->quantity)->toBe(10.0);

    expect(Cost::where('land_season_id', $season->id)->exists())->toBeTrue();
});
