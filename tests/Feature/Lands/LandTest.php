<?php

use App\Domains\Crops\Models\Crop;
use App\Domains\Lands\Enums\LandStatus;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;
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
    $season = LandSeason::factory()->create();

    $this->put(route('lands.seasons.update', $season), [
        'land_id' => $season->land_id,
        'crop_id' => $season->crop_id,
        'planting_date' => '2025-04-01',
        'cultivated_area' => 10,
        'status' => $season->status,
    ])->assertSessionHasNoErrors();

    expect($season->fresh()->planting_date->format('Y-m-d'))->toBe('2025-04-01');
});

test('season can be deleted', function () {
    $season = LandSeason::factory()->create();

    $this->delete(route('lands.seasons.destroy', $season))
        ->assertRedirect();

    expect(LandSeason::find($season->id))->toBeNull();
});

// ─── Contracts ─────────────────────────────────

test('contract can be stored for a land', function () {
    $land = Land::factory()->create();

    $this->post(route('lands.contracts.store'), [
        'land_id' => $land->id,
        'type' => 'إيجار',
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
