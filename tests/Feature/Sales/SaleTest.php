<?php

use App\Domains\Lands\Models\Harvest;
use App\Domains\Parties\Models\Party;
use App\Domains\Sales\Models\Sale;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('index page renders', function () {
    Sale::factory()->count(3)->create();

    $this->get(route('sales.index'))
        ->assertInertia(fn ($page) => $page->component('Sales/Index'));
});

test('create page renders', function () {
    $this->get(route('sales.create'))
        ->assertInertia(fn ($page) => $page->component('Sales/Create'));
});

test('sale can be stored', function () {
    $harvest = Harvest::factory()->create();
    $party = Party::factory()->merchant()->create();

    $this->post(route('sales.store'), [
        'harvest_id' => $harvest->id,
        'party_id' => $party->id,
        'quantity' => 100,
        'unit_price' => 250,
        'date' => '2025-06-15',
        'payment_type' => 'نقدي',
    ])->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(Sale::where('party_id', $party->id)->exists())->toBeTrue();
});

test('sale validation fails with missing fields', function () {
    $this->post(route('sales.store'), [])
        ->assertSessionHasErrors(['harvest_id', 'party_id', 'quantity', 'unit_price', 'date', 'payment_type']);
});

test('sale show page renders', function () {
    $sale = Sale::factory()->create();

    $this->get(route('sales.show', $sale))
        ->assertInertia(fn ($page) => $page->component('Sales/Show'));
});
