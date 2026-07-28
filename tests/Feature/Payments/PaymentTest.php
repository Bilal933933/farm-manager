<?php

use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Models\Payment;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('index page renders', function () {
    Payment::factory()->count(3)->create();

    $this->get(route('payments.index'))
        ->assertInertia(fn ($page) => $page->component('Payments/Index'));
});

test('create page renders', function () {
    $this->get(route('payments.create'))
        ->assertInertia(fn ($page) => $page->component('Payments/Create'));
});

test('payment can be stored', function () {
    $party = Party::factory()->lessor()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => 'دفع',
        'date' => '2025-06-01',
        'amount' => 25000,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('payments.index'));
});

test('payment validation fails with missing fields', function () {
    $this->post(route('payments.store'), [])
        ->assertSessionHasErrors(['party_id', 'type', 'date', 'amount']);
});

test('payment show page renders', function () {
    $payment = Payment::factory()->create();

    $this->get(route('payments.show', $payment))
        ->assertInertia(fn ($page) => $page->component('Payments/Show'));
});

test('payment can be updated', function () {
    $party = Party::factory()->farmer()->create();
    $payment = Payment::factory()->payment()->create(['party_id' => $party->id]);

    $this->put(route('payments.update', $payment), [
        'party_id' => $payment->party_id,
        'type' => $payment->type->value,
        'date' => $payment->date->format('Y-m-d'),
        'amount' => 50000,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('payments.show', $payment));

    expect((float) $payment->fresh()->amount)->toBe(50000.0);
});
