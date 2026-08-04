<?php

use App\Domains\Parties\Actions\SummarizeAmanatFinancials;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Enums\PaymentType;
use App\Domains\Payments\Models\Payment;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

// ─── SummarizeAmanatFinancials ──────────────────────────────

test('amanat summary returns null when party has no payments', function () {
    $party = Party::factory()->amanat()->create();

    $summary = app(SummarizeAmanatFinancials::class)->execute($party);

    expect($summary)->toBeNull();
});

test('amanat summary computes deposited, returned and remaining amounts', function () {
    $party = Party::factory()->amanat()->create();

    Payment::factory()->create([
        'party_id' => $party->id,
        'type' => PaymentType::Receipt->value,
        'amount' => 10000,
    ]);

    Payment::factory()->create([
        'party_id' => $party->id,
        'type' => PaymentType::Receipt->value,
        'amount' => 2500,
    ]);

    Payment::factory()->create([
        'party_id' => $party->id,
        'type' => PaymentType::Payment->value,
        'amount' => 4000,
    ]);

    $summary = app(SummarizeAmanatFinancials::class)->execute($party);

    expect($summary)->not->toBeNull()
        ->and($summary['total_deposited'])->toBe(12500.0)
        ->and($summary['total_returned'])->toBe(4000.0)
        ->and($summary['total_remaining'])->toBe(8500.0);
});

test('payments for other parties do not affect amanat summary', function () {
    $party = Party::factory()->amanat()->create();
    $other = Party::factory()->amanat()->create();

    Payment::factory()->create([
        'party_id' => $other->id,
        'type' => PaymentType::Receipt->value,
        'amount' => 99999,
    ]);

    $summary = app(SummarizeAmanatFinancials::class)->execute($party);

    expect($summary)->toBeNull();
});

// ─── Party Show Page Exposes Amanat Financials ──────────────

test('party show page exposes amanat financials for amanat party', function () {
    $party = Party::factory()->amanat()->create();

    Payment::factory()->create([
        'party_id' => $party->id,
        'type' => PaymentType::Receipt->value,
        'amount' => 8000,
    ]);

    $this->get(route('parties.show', $party))
        ->assertInertia(fn ($page) => $page
            ->component('Parties/Show')
            ->has('amanatFinancials')
            ->where('amanatFinancials.total_deposited', 8000)
            ->has('party.payments')
        );
});
