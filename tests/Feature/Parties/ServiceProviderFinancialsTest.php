<?php

use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Parties\Actions\SummarizeServiceProviderFinancials;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Enums\PaymentType;
use App\Domains\Payments\Models\Payment;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('service provider summary returns null when party has no costs', function () {
    $party = Party::factory()->serviceProvider()->create();

    expect(app(SummarizeServiceProviderFinancials::class)->execute($party))->toBeNull();
});

test('service provider summary computes services, paid and remaining amounts', function () {
    $party = Party::factory()->serviceProvider()->create();
    $season = LandSeason::factory()->create();

    Cost::factory()->create([
        'party_id' => $party->id,
        'land_id' => $season->land_id,
        'land_season_id' => $season->id,
        'amount' => 1000,
    ]);

    Cost::factory()->create([
        'party_id' => $party->id,
        'land_id' => $season->land_id,
        'land_season_id' => $season->id,
        'amount' => 500,
    ]);

    Cost::factory()->create([
        'party_id' => null,
        'land_id' => $season->land_id,
        'land_season_id' => $season->id,
        'amount' => 999,
    ]);

    Payment::factory()->create([
        'party_id' => $party->id,
        'type' => PaymentType::Payment->value,
        'amount' => 400,
    ]);

    Payment::factory()->create([
        'party_id' => $party->id,
        'type' => PaymentType::Advance->value,
        'amount' => 100,
    ]);

    $summary = app(SummarizeServiceProviderFinancials::class)->execute($party);

    expect($summary)->not->toBeNull()
        ->and($summary['total_services_amount'])->toBe(1500.0)
        ->and($summary['total_paid'])->toBe(500.0)
        ->and($summary['total_remaining'])->toBe(1000.0);
});

test('party show page exposes service provider financials', function () {
    $party = Party::factory()->serviceProvider()->create();
    $season = LandSeason::factory()->create();

    Cost::factory()->create([
        'party_id' => $party->id,
        'land_id' => $season->land_id,
        'land_season_id' => $season->id,
        'amount' => 2000,
    ]);

    $this->get(route('parties.show', $party))
        ->assertInertia(fn ($page) => $page
            ->component('Parties/Show')
            ->has('serviceProviderFinancials')
            ->where('serviceProviderFinancials.total_services_amount', 2000)
            ->where('serviceProviderFinancials.total_remaining', 2000)
        );
});

test('service provider accepts payment and advance but rejects receipt', function () {
    $party = Party::factory()->serviceProvider()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Payment->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ])->assertSessionHasNoErrors();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Advance->value,
        'date' => '2026-01-01',
        'amount' => '500',
    ])->assertSessionHasNoErrors();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Receipt->value,
        'date' => '2026-01-01',
        'amount' => '100',
    ])->assertSessionHasErrors('type');
});
