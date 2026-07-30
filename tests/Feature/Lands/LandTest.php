<?php

use App\Domains\Crops\Models\Crop;
use App\Domains\Lands\Actions\CalculateFarmerSettlement;
use App\Domains\Lands\Enums\LandStatus;
use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\Harvest;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Parties\Models\Party;
use App\Domains\Sales\Models\Sale;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('index page renders', function () {
    Land::factory()->count(3)->create();

    $this->get(route('lands.index'))
        ->assertInertia(fn ($page) => $page->component('Lands/Index'));
});

test('create page renders', function () {
    $this->get(route('lands.create'))
        ->assertInertia(fn ($page) => $page->component('Lands/Create'));
});

test('land can be stored', function () {
    $this->post(route('lands.store'), [
        'name' => 'أرض اختبار',
        'area' => 10,
        'area_unit' => 'دونم',
        'status' => LandStatus::Active->value,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('lands.index'));

    expect(Land::where('name', 'أرض اختبار')->exists())->toBeTrue();
});

test('land validation fails with missing required fields', function () {
    $this->post(route('lands.store'), [])
        ->assertSessionHasErrors(['name', 'area', 'area_unit', 'status']);
});

test('land show page renders', function () {
    $land = Land::factory()->create();

    $this->get(route('lands.show', $land))
        ->assertInertia(fn ($page) => $page->component('Lands/Show'));
});

test('land can be updated', function () {
    $land = Land::factory()->create();

    $this->put(route('lands.update', $land), [
        'name' => 'أرض معدلة',
        'area' => 15,
        'area_unit' => $land->area_unit,
        'status' => $land->status,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('lands.index'));

    expect($land->fresh()->name)->toBe('أرض معدلة');
});

test('land can be deleted', function () {
    $land = Land::factory()->create();

    $this->delete(route('lands.destroy', $land))
        ->assertRedirect(route('lands.index'));

    expect(Land::find($land->id))->toBeNull();
});

// ─── Seasons ───────────────────────────────────

test('season can be stored for a land', function () {
    $land = Land::factory()->create();
    $crop = Crop::factory()->create();

    $this->post(route('lands.seasons.store'), [
        'land_id' => $land->id,
        'crop_id' => $crop->id,
        'planting_date' => '2025-03-01',
        'cultivated_area' => 8,
        'status' => 'نشط',
    ])->assertSessionHasNoErrors();

    expect($land->seasons()->count())->toBe(1);
});

test('season can be shown', function () {
    $season = LandSeason::factory()->create();

    $this->get(route('lands.seasons.show', [$season->land, $season]))
        ->assertInertia(fn ($page) => $page->component('Lands/SeasonShow'));
});

test('season can be updated', function () {
    $season = LandSeason::factory()->create(['status' => 'قادم']);

    $this->put(route('lands.seasons.update', $season), [
        'land_id' => $season->land_id,
        'crop_id' => $season->crop_id,
        'planting_date' => '2025-04-01',
        'cultivated_area' => 10,
        'notes' => 'محدث',
    ])->assertSessionHasNoErrors();

    expect($season->fresh()->planting_date->format('Y-m-d'))->toBe('2025-04-01');
    expect($season->fresh()->notes)->toBe('محدث');
});

test('season can be deleted', function () {
    $season = LandSeason::factory()->create(['status' => 'قادم']);

    $this->delete(route('lands.seasons.destroy', $season))
        ->assertRedirect();

    expect(LandSeason::find($season->id))->toBeNull();
});

// ─── Contracts ─────────────────────────────────

test('contract can be stored for a land', function () {
    $land = Land::factory()->create();

    $this->post(route('lands.contracts.store'), [
        'land_id' => $land->id,
        'type' => 'مؤجر',
        'start_date' => '2025-01-01',
        'end_date' => '2027-12-31',
        'amount' => 150000,
    ])->assertSessionHasNoErrors();

    expect($land->contracts()->count())->toBe(1);
});

test('contract can be updated', function () {
    $contract = LandContract::factory()->create();

    $this->put(route('lands.contracts.update', $contract), [
        'land_id' => $contract->land_id,
        'type' => $contract->type,
        'start_date' => '2025-01-01',
        'amount' => 200000,
    ])->assertSessionHasNoErrors();

    expect((float) $contract->fresh()->amount)->toBe(200000.0);
});

test('contract can be deleted', function () {
    $contract = LandContract::factory()->create();

    $this->delete(route('lands.contracts.destroy', $contract))
        ->assertRedirect();

    expect(LandContract::find($contract->id))->toBeNull();
});

// ─── Contracts: New types & validation ─────────────────

test('farmer contract with percentage does not require amount', function () {
    $land = Land::factory()->create();

    $this->post(route('lands.contracts.store'), [
        'land_id' => $land->id,
        'type' => 'مزارع',
        'settlement_type' => 'نسبة',
        'share_percentage' => 30,
        'start_date' => '2025-01-01',
    ])->assertSessionHasNoErrors();

    expect($land->contracts()->count())->toBe(1);
});

test('farmer contract with fixed amount does require amount', function () {
    $land = Land::factory()->create();

    $this->post(route('lands.contracts.store'), [
        'land_id' => $land->id,
        'type' => 'مزارع',
        'settlement_type' => 'ثابت',
        'amount' => 50000,
        'start_date' => '2025-01-01',
    ])->assertSessionHasNoErrors();

    expect($land->contracts()->count())->toBe(1);
});

test('farmer contract with fixed amount fails when amount is missing', function () {
    $land = Land::factory()->create();

    $this->post(route('lands.contracts.store'), [
        'land_id' => $land->id,
        'type' => 'مزارع',
        'settlement_type' => 'ثابت',
        'start_date' => '2025-01-01',
    ])->assertSessionHasErrors('amount');
});

test('non-farmer contract rejects settlement_type', function () {
    $land = Land::factory()->create();
    $party = Party::factory()->lessor()->create();

    $this->post(route('lands.contracts.store'), [
        'land_id' => $land->id,
        'party_id' => $party->id,
        'type' => 'مؤجر',
        'settlement_type' => 'ثابت',
        'start_date' => '2025-01-01',
        'amount' => 100000,
    ])->assertSessionHasErrors('settlement_type');
});

test('non-farmer contract rejects share_percentage', function () {
    $land = Land::factory()->create();
    $party = Party::factory()->lessor()->create();

    $this->post(route('lands.contracts.store'), [
        'land_id' => $land->id,
        'party_id' => $party->id,
        'type' => 'مستأجر',
        'share_percentage' => 50,
        'start_date' => '2025-01-01',
        'amount' => 100000,
    ])->assertSessionHasErrors('share_percentage');
});

test('season can be stored with farmer_contract_id', function () {
    $land = Land::factory()->create();
    $crop = Crop::factory()->create();
    $farmer = Party::factory()->farmer()->create();
    $contract = LandContract::factory()->farmer()->create(['land_id' => $land->id, 'party_id' => $farmer->id]);

    $this->post(route('lands.seasons.store'), [
        'land_id' => $land->id,
        'crop_id' => $crop->id,
        'planting_date' => '2025-03-01',
        'farmer_id' => $farmer->id,
        'farmer_contract_id' => $contract->id,
        'status' => 'نشط',
    ])->assertSessionHasNoErrors();

    $season = $land->seasons()->first();
    expect((int) $season->farmer_contract_id)->toBe($contract->id);
});

// ─── CalculateFarmerSettlement ────────────────────────

test('CalculateFarmerSettlement returns null when no farmer linked', function () {
    $season = LandSeason::factory()->create();

    $result = app(CalculateFarmerSettlement::class)->forSeason($season);

    expect($result)->toBeNull();
});

test('CalculateFarmerSettlement returns correct values for percentage contract', function () {
    $land = Land::factory()->create();
    $farmer = Party::factory()->farmer()->create();
    $contract = LandContract::factory()->farmer()->create([
        'land_id' => $land->id,
        'party_id' => $farmer->id,
        'settlement_type' => 'نسبة',
        'share_percentage' => 25,
    ]);

    $season = LandSeason::factory()->create([
        'land_id' => $land->id,
        'farmer_id' => $farmer->id,
        'farmer_contract_id' => $contract->id,
    ]);

    $harvest = Harvest::factory()->create([
        'land_season_id' => $season->id,
        'quantity' => 100,
    ]);

    Sale::factory()->create([
        'harvest_id' => $harvest->id,
        'quantity' => 100,
        'unit_price' => 50,
    ]);

    Cost::factory()->create([
        'land_id' => $land->id,
        'land_season_id' => $season->id,
        'borne_by' => 'مشترك',
        'amount' => 1000,
    ]);

    $result = app(CalculateFarmerSettlement::class)->forSeason($season);

    expect($result)->not->toBeNull();
    expect((float) $result['total_revenue'])->toBe(5000.0);
    expect((float) $result['shared_cost'])->toBe(1000.0);
    expect((float) $result['net_revenue'])->toBe(4000.0);
    expect((float) $result['farmer_share'])->toBe(1000.0);
    expect((float) $result['owner_share'])->toBe(3000.0);
});
