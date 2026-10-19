<?php

use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\Harvest;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Models\Payment;
use App\Domains\Purchases\Models\Purchase;
use App\Domains\Purchases\Models\PurchaseItem;
use App\Domains\Sales\Models\Sale;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('stats')
        ->has('activeSeasons')
        ->has('latestSales')
        ->has('partyBalances'));
});

test('dashboard counts active lands and running seasons only', function () {
    $this->actingAs(User::factory()->create());

    $land = Land::factory()->create();
    Land::factory()->inactive()->create();

    LandSeason::factory()->for($land)->create(['status' => SeasonStatus::Active->value]);
    LandSeason::factory()->for($land)->create(['status' => SeasonStatus::Harvesting->value]);
    LandSeason::factory()->for($land)->create(['status' => SeasonStatus::Completed->value]);

    $this->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->where('stats.activeLands', 1)
            ->where('stats.totalLands', 2)
            ->where('stats.activeSeasons', 2));
});

test('dashboard totals sales costs and profit from stored records', function () {
    $this->actingAs(User::factory()->create());

    Sale::factory()->create(['quantity' => 10, 'unit_price' => 100]);
    Sale::factory()->create(['quantity' => 5, 'unit_price' => 20]);
    Cost::factory()->create(['amount' => 300]);

    $this->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->where('stats.salesTotal', 1100)
            ->where('stats.costsTotal', 300)
            ->where('stats.profit', 800));
});

test('dashboard limits each list to five records', function () {
    $this->actingAs(User::factory()->create());

    Sale::factory()->count(6)->create();

    $season = LandSeason::factory()->create(['status' => SeasonStatus::Active->value]);
    LandSeason::factory()->count(6)->for($season->land)->create(['status' => SeasonStatus::Active->value]);

    $this->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->has('latestSales', 5)
            ->has('activeSeasons', 5));
});

test('dashboard exposes receivable and payable party balances', function () {
    $this->actingAs(User::factory()->create());

    $merchant = Party::factory()->merchant()->create();
    $harvest = Harvest::factory()->create();
    Sale::factory()->for($merchant)->for($harvest)->create(['quantity' => 100, 'unit_price' => 10]);
    Payment::factory()->for($merchant)->receipt()->create(['amount' => 200]);

    $supplier = Party::factory()->supplier()->create();
    $purchase = Purchase::factory()->for($supplier)->create();
    PurchaseItem::factory()->for($purchase)->create(['quantity' => 10, 'unit_price' => 50]);
    Payment::factory()->for($supplier)->payment()->create(['amount' => 100]);

    $this->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->has('partyBalances', 2)
            ->where('partyBalances.0.kind', 'receivable')
            ->where('partyBalances.0.amount', 800)
            ->where('partyBalances.1.kind', 'payable')
            ->where('partyBalances.1.amount', 400));
});

test('dashboard skips parties with a settled balance', function () {
    $this->actingAs(User::factory()->create());

    $merchant = Party::factory()->merchant()->create();
    Sale::factory()->for($merchant)->for(Harvest::factory())->create(['quantity' => 10, 'unit_price' => 10]);
    Payment::factory()->for($merchant)->receipt()->create(['amount' => 500]);

    $this->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page->has('partyBalances', 0));
});
