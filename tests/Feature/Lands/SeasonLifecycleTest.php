<?php

use App\Domains\Lands\Actions\BeginHarvestAction;
use App\Domains\Lands\Actions\CalculateSeasonFinancials;
use App\Domains\Lands\Actions\CancelSeasonAction;
use App\Domains\Lands\Actions\CompleteSeasonAction;
use App\Domains\Lands\Actions\DeleteLandSeason;
use App\Domains\Lands\Actions\RecordHarvest;
use App\Domains\Lands\Actions\StartSeasonAction;
use App\Domains\Lands\Actions\UpdateLandSeason;
use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\Harvest;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Models\Payment;
use App\Domains\Sales\Models\Sale;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

// ─── StartSeasonAction ──────────────────────────────

test('StartSeasonAction transitions Upcoming to Active', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Upcoming]);

    app(StartSeasonAction::class)->execute($season);

    expect($season->fresh()->status)->toBe(SeasonStatus::Active);
});

test('StartSeasonAction fails if not Upcoming', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Active]);

    app(StartSeasonAction::class)->execute($season);
})->throws(RuntimeException::class, 'لا يمكن بدء موسم إلا إذا كان في حالة "قادم".');

test('StartSeasonAction fails if another Active season exists for same land', function () {
    $land = Land::factory()->create();
    LandSeason::factory()->create(['land_id' => $land->id, 'status' => SeasonStatus::Active]);
    $season = LandSeason::factory()->create(['land_id' => $land->id, 'status' => SeasonStatus::Upcoming]);

    app(StartSeasonAction::class)->execute($season);
})->throws(RuntimeException::class, 'يوجد موسم نشط بالفعل لهذه الأرض.');

// ─── BeginHarvestAction ────────────────────────────

test('BeginHarvestAction transitions Active to Harvesting', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Active]);

    app(BeginHarvestAction::class)->execute($season);

    expect($season->fresh()->status)->toBe(SeasonStatus::Harvesting);
});

test('BeginHarvestAction fails if not Active', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Upcoming]);

    app(BeginHarvestAction::class)->execute($season);
})->throws(RuntimeException::class, 'لا يمكن بدء الحصاد إلا إذا كان الموسم في حالة "نشط".');

// ─── CompleteSeasonAction ──────────────────────────

test('CompleteSeasonAction completes season with snapshot', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Harvesting]);
    $harvest = Harvest::factory()->create(['land_season_id' => $season->id, 'quantity' => 100]);
    Sale::factory()->create(['harvest_id' => $harvest->id, 'quantity' => 100, 'unit_price' => 50]);
    Cost::factory()->create(['land_season_id' => $season->id, 'amount' => 2000]);

    $result = app(CompleteSeasonAction::class)->execute($season);

    expect($result->status)->toBe(SeasonStatus::Completed);
    expect((float) $result->actual_revenue)->toBe(5000.0);
    expect((float) $result->actual_cost)->toBe(2000.0);
    expect((float) $result->actual_profit)->toBe(3000.0);
    expect($result->completed_at)->not->toBeNull();
});

test('CompleteSeasonAction fails if already Completed', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Completed]);

    app(CompleteSeasonAction::class)->execute($season);
})->throws(RuntimeException::class, 'الموسم مغلق بالفعل.');

test('CompleteSeasonAction fails if Upcoming', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Upcoming]);

    app(CompleteSeasonAction::class)->execute($season);
})->throws(RuntimeException::class, 'لا يمكن إغلاق موسم لم يبدأ بعد.');

test('CompleteSeasonAction fails if Cancelled', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Cancelled]);

    app(CompleteSeasonAction::class)->execute($season);
})->throws(RuntimeException::class, 'لا يمكن إغلاق موسم ملغي.');

// ─── CancelSeasonAction ───────────────────────────

test('CancelSeasonAction transitions Upcoming to Cancelled', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Upcoming]);

    app(CancelSeasonAction::class)->execute($season);

    expect($season->fresh()->status)->toBe(SeasonStatus::Cancelled);
});

test('CancelSeasonAction fails if not Upcoming', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Active]);

    app(CancelSeasonAction::class)->execute($season);
})->throws(RuntimeException::class, 'لا يمكن إلغاء إلا المواسم في حالة "قادم".');

// ─── UpdateLandSeason ─────────────────────────────

test('UpdateLandSeason fails if season is Completed', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Completed]);

    app(UpdateLandSeason::class)->execute($season, ['notes' => 'تعديل']);
})->throws(RuntimeException::class, 'لا يمكن تعديل موسم في حالة "منتهي" أو "ملغي".');

test('UpdateLandSeason fails if season is Cancelled', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Cancelled]);

    app(UpdateLandSeason::class)->execute($season, ['notes' => 'تعديل']);
})->throws(RuntimeException::class, 'لا يمكن تعديل موسم في حالة "منتهي" أو "ملغي".');

test('UpdateLandSeason strips status from data', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Active, 'notes' => null]);

    app(UpdateLandSeason::class)->execute($season, ['notes' => 'محدث', 'status' => SeasonStatus::Completed->value]);

    expect($season->fresh()->notes)->toBe('محدث');
    expect($season->fresh()->status)->toBe(SeasonStatus::Active);
});

test('UpdateLandSeason updates editable fields for active season', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Active]);

    app(UpdateLandSeason::class)->execute($season, ['expected_cost' => 99999, 'notes' => 'محدث']);

    expect((float) $season->fresh()->expected_cost)->toBe(99999.0);
});

// ─── DeleteLandSeason ─────────────────────────────

test('DeleteLandSeason fails if season is Completed', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Completed]);

    app(DeleteLandSeason::class)->execute($season);
})->throws(RuntimeException::class, 'لا يمكن حذف موسم في حالة "منتهي" أو "ملغي".');

test('DeleteLandSeason deletes Upcoming season', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Upcoming]);

    app(DeleteLandSeason::class)->execute($season);

    expect(LandSeason::find($season->id))->toBeNull();
});

// ─── RecordHarvest ────────────────────────────────

test('RecordHarvest fails if season is Upcoming', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Upcoming]);

    app(RecordHarvest::class)->execute(['land_season_id' => $season->id, 'date' => '2025-04-01', 'quantity' => 50]);
})->throws(RuntimeException::class, 'لا يمكن تسجيل حصاد لموسم في حالة "منتهي" أو "ملغي" أو "قادم".');

test('RecordHarvest fails if season is Completed', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Completed]);

    app(RecordHarvest::class)->execute(['land_season_id' => $season->id, 'date' => '2025-04-01', 'quantity' => 50]);
})->throws(RuntimeException::class);

test('RecordHarvest succeeds for Active season', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Active]);

    $harvest = app(RecordHarvest::class)->execute(['land_season_id' => $season->id, 'date' => '2025-04-01', 'quantity' => 50]);

    expect($harvest)->toBeInstanceOf(Harvest::class);
    expect((float) $harvest->quantity)->toBe(50.0);
});

// ─── CalculateSeasonFinancials ────────────────────

test('CalculateSeasonFinancials does not update DB for Completed seasons', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Completed, 'actual_cost' => 100, 'actual_revenue' => 500]);
    $harvest = Harvest::factory()->create(['land_season_id' => $season->id, 'quantity' => 100]);
    Sale::factory()->create(['harvest_id' => $harvest->id, 'quantity' => 100, 'unit_price' => 100]);
    Cost::factory()->create(['land_season_id' => $season->id, 'amount' => 10000]);

    app(CalculateSeasonFinancials::class)->forSeason($season);

    $fresh = $season->fresh();
    expect((float) $fresh->actual_revenue)->toBe(500.0);
    expect((float) $fresh->actual_cost)->toBe(100.0);
});

test('CalculateSeasonFinancials does not write to DB for any season', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Active, 'actual_cost' => null, 'actual_revenue' => null]);
    $harvest = Harvest::factory()->create(['land_season_id' => $season->id, 'quantity' => 100]);
    Sale::factory()->create(['harvest_id' => $harvest->id, 'quantity' => 100, 'unit_price' => 50]);
    Cost::factory()->create(['land_season_id' => $season->id, 'amount' => 2000]);

    $result = app(CalculateSeasonFinancials::class)->forSeason($season);

    expect($result['total_sales'])->toBe(5000.0);
    expect($result['total_cost'])->toBe(2000.0);
    expect($result['profit'])->toBe(3000.0);

    $fresh = $season->fresh();
    expect($fresh->actual_revenue)->toBeNull();
    expect($fresh->actual_cost)->toBeNull();
});

// ─── HTTP routes ─────────────────────────────────

test('POST start season transitions via HTTP', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Upcoming]);

    $this->post(route('lands.seasons.start', $season))
        ->assertSessionHasNoErrors();

    expect($season->fresh()->status)->toBe(SeasonStatus::Active);
});

test('POST begin-harvest transitions via HTTP', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Active]);

    $this->post(route('lands.seasons.begin-harvest', $season))
        ->assertSessionHasNoErrors();

    expect($season->fresh()->status)->toBe(SeasonStatus::Harvesting);
});

test('POST complete season transitions via HTTP', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Harvesting]);

    $this->post(route('lands.seasons.complete', $season))
        ->assertSessionHasNoErrors();

    expect($season->fresh()->status)->toBe(SeasonStatus::Completed);
});

test('POST cancel season transitions via HTTP', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Upcoming]);

    $this->post(route('lands.seasons.cancel', $season))
        ->assertSessionHasNoErrors();

    expect($season->fresh()->status)->toBe(SeasonStatus::Cancelled);
});

test('POST start season returns error for invalid transition', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Completed]);

    $this->post(route('lands.seasons.start', $season))
        ->assertStatus(302);

    expect($season->fresh()->status)->toBe(SeasonStatus::Completed);
});

// ─── Store Season request status restriction ──────

test('cannot create season with Harvesting status via request', function () {
    $land = Land::factory()->create();

    $this->post(route('lands.seasons.store'), [
        'land_id' => $land->id,
        'planting_date' => '2025-03-01',
        'status' => SeasonStatus::Harvesting->value,
    ])->assertSessionHasErrors('status');
});

test('cannot create season with Completed status via request', function () {
    $land = Land::factory()->create();

    $this->post(route('lands.seasons.store'), [
        'land_id' => $land->id,
        'planting_date' => '2025-03-01',
        'status' => SeasonStatus::Completed->value,
    ])->assertSessionHasErrors('status');
});

// ─── Full lifecycle flow ─────────────────────────

test('full lifecycle from Upcoming to Completed', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Upcoming]);
    $harvest = Harvest::factory()->create(['land_season_id' => $season->id, 'quantity' => 50]);
    Sale::factory()->create(['harvest_id' => $harvest->id, 'quantity' => 50, 'unit_price' => 30]);
    Cost::factory()->create(['land_season_id' => $season->id, 'amount' => 500]);

    app(StartSeasonAction::class)->execute($season);
    expect($season->fresh()->status)->toBe(SeasonStatus::Active);

    app(BeginHarvestAction::class)->execute($season);
    expect($season->fresh()->status)->toBe(SeasonStatus::Harvesting);

    $completed = app(CompleteSeasonAction::class)->execute($season);
    expect($completed->status)->toBe(SeasonStatus::Completed);
    expect((float) $completed->actual_revenue)->toBe(1500.0);
    expect((float) $completed->actual_cost)->toBe(500.0);
    expect((float) $completed->actual_profit)->toBe(1000.0);
    expect($completed->completed_at)->not->toBeNull();
});

// ─── CompleteSeasonAction: harvest & advance checks ─────

test('CompleteSeasonAction fails when harvest has unsold quantity', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Harvesting]);
    Harvest::factory()->create(['land_season_id' => $season->id, 'quantity' => 100]);
    Sale::factory()->create(['harvest_id' => $season->harvests->first()->id, 'quantity' => 60, 'unit_price' => 50]);

    app(CompleteSeasonAction::class)->execute($season);
})->throws(RuntimeException::class, 'من الكمية غير مباعة');

test('CompleteSeasonAction succeeds when all harvest quantity is sold', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Harvesting]);
    $harvest = Harvest::factory()->create(['land_season_id' => $season->id, 'quantity' => 100]);
    Sale::factory()->create(['harvest_id' => $harvest->id, 'quantity' => 100, 'unit_price' => 50]);

    $result = app(CompleteSeasonAction::class)->execute($season);

    expect($result->status)->toBe(SeasonStatus::Completed);
});

test('CompleteSeasonAction succeeds when there are no harvests', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Harvesting]);

    $result = app(CompleteSeasonAction::class)->execute($season);

    expect($result->status)->toBe(SeasonStatus::Completed);
});

test('CompleteSeasonAction fails when advances exist without farmer contract', function () {
    $season = LandSeason::factory()->create(['status' => SeasonStatus::Harvesting, 'farmer_id' => null, 'farmer_contract_id' => null]);
    Payment::factory()->advance()->create([
        'land_season_id' => $season->id,
        'amount' => 5000,
    ]);

    app(CompleteSeasonAction::class)->execute($season);
})->throws(RuntimeException::class, 'سلف');

test('CompleteSeasonAction allows advances when farmer contract exists', function () {
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
        'status' => SeasonStatus::Harvesting,
        'farmer_id' => $farmer->id,
        'farmer_contract_id' => $contract->id,
    ]);
    $harvest = Harvest::factory()->create(['land_season_id' => $season->id, 'quantity' => 100]);
    Sale::factory()->create(['harvest_id' => $harvest->id, 'quantity' => 100, 'unit_price' => 50]);
    Payment::factory()->advance()->create([
        'land_season_id' => $season->id,
        'party_id' => $farmer->id,
        'amount' => 5000,
    ]);

    $result = app(CompleteSeasonAction::class)->execute($season);

    expect($result->status)->toBe(SeasonStatus::Completed);
});
