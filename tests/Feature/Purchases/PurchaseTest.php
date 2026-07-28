<?php

use App\Domains\Parties\Models\Party;
use App\Domains\Products\Models\Product;
use App\Domains\Purchases\Models\Purchase;
use App\Domains\Purchases\Models\PurchaseItem;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('index page renders', function () {
    $purchases = Purchase::factory()->count(2)->create();

    // Ensure purchase items exist for the purchases
    foreach ($purchases as $p) {
        PurchaseItem::factory()->create(['purchase_id' => $p->id]);
    }

    $this->get(route('purchases.index'))
        ->assertInertia(fn ($page) => $page->component('Purchases/Index'));
});

test('create page renders', function () {
    $this->get(route('purchases.create'))
        ->assertInertia(fn ($page) => $page->component('Purchases/Create'));
});

test('purchase can be stored', function () {
    $party = Party::factory()->supplier()->create();
    $product = Product::factory()->create();

    $this->post(route('purchases.store'), [
        'party_id' => $party->id,
        'date' => '2025-06-01',
        'payment_type' => 'نقدي',
        'items' => [
            ['product_id' => $product->id, 'quantity' => 50, 'unit_price' => 120],
        ],
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('purchases.index'));

    expect(Purchase::where('party_id', $party->id)->exists())->toBeTrue();
});

test('purchase validation fails with missing fields', function () {
    $this->post(route('purchases.store'), [])
        ->assertSessionHasErrors(['party_id', 'date', 'payment_type', 'items']);
});

test('purchase show page renders', function () {
    $purchase = Purchase::factory()->create();
    PurchaseItem::factory()->create(['purchase_id' => $purchase->id]);

    $this->get(route('purchases.show', $purchase))
        ->assertInertia(fn ($page) => $page->component('Purchases/Show'));
});
