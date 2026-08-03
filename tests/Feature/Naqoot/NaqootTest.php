<?php

use App\Domains\Naqoot\Enums\NaqootDirection;
use App\Domains\Naqoot\Models\Naqoot;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

// ─── CRUD ──────────────────────────────────────────────

test('naqoot can be created for us', function () {
    $this->post(route('naqoot.store'), [
        'name' => 'أحمد محمد',
        'date' => '2026-08-01',
        'amount' => '1000',
        'direction' => NaqootDirection::ForUs->value,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('naqoot.index'));

    $naqoot = Naqoot::where('name', 'أحمد محمد')->first();

    expect($naqoot)->not->toBeNull()
        ->and($naqoot->direction->value)->toBe(NaqootDirection::ForUs->value);
});

test('naqoot can be created on us', function () {
    $this->post(route('naqoot.store'), [
        'name' => 'محمد خالد',
        'date' => '2026-08-02',
        'amount' => '500',
        'direction' => NaqootDirection::OnUs->value,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('naqoot.index'));

    expect(Naqoot::where('name', 'محمد خالد')->exists())->toBeTrue();
});

test('naqoot can be updated', function () {
    $naqoot = Naqoot::factory()->forUs()->create();

    $this->put(route('naqoot.update', $naqoot), [
        'name' => 'اسم معدل',
        'date' => '2026-08-03',
        'amount' => '750',
        'direction' => NaqootDirection::OnUs->value,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('naqoot.index'));

    $fresh = $naqoot->fresh();

    expect($fresh->name)->toBe('اسم معدل')
        ->and($fresh->amount)->toBe('750.00')
        ->and($fresh->direction->value)->toBe(NaqootDirection::OnUs->value);
});

test('naqoot can be deleted', function () {
    $naqoot = Naqoot::factory()->create();

    $this->delete(route('naqoot.destroy', $naqoot))
        ->assertRedirect(route('naqoot.index'));

    expect(Naqoot::find($naqoot->id))->toBeNull();
});

// ─── Validation ────────────────────────────────────────

test('invalid direction is rejected', function () {
    $this->post(route('naqoot.store'), [
        'name' => 'طرف خاطئ',
        'date' => '2026-08-01',
        'amount' => '100',
        'direction' => 'اتجاه وهمي',
    ])->assertSessionHasErrors('direction');
});

test('missing name is rejected', function () {
    $this->post(route('naqoot.store'), [
        'date' => '2026-08-01',
        'amount' => '100',
        'direction' => NaqootDirection::ForUs->value,
    ])->assertSessionHasErrors('name');
});

test('non-positive amount is rejected', function () {
    $this->post(route('naqoot.store'), [
        'name' => 'أحمد',
        'date' => '2026-08-01',
        'amount' => '0',
        'direction' => NaqootDirection::ForUs->value,
    ])->assertSessionHasErrors('amount');
});

// ─── Index summary ─────────────────────────────────────

test('index page shows summary totals', function () {
    Naqoot::factory()->forUs()->create(['amount' => 1000]);
    Naqoot::factory()->forUs()->create(['amount' => 500]);
    Naqoot::factory()->onUs()->create(['amount' => 300]);

    $this->get(route('naqoot.index'))
        ->assertInertia(fn ($page) => $page
            ->component('Naqoot/Index')
            ->where('summary.totalForUs', 1500)
            ->where('summary.totalOnUs', 300)
            ->where('summary.net', 1200)
            ->where('summary.countForUs', 2)
            ->where('summary.countOnUs', 1)
            ->has('naqoot', 3)
        );
});
