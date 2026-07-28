<?php

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
