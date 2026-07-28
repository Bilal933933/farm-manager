<?php

use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandSeason;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('cost index page renders', function () {
    Cost::factory()->count(3)->create();

    $this->get(route('costs.index'))
        ->assertInertia(fn ($page) => $page->component('Costs/Index'));
});

test('cost create page renders', function () {
    $this->get(route('costs.create'))
        ->assertInertia(fn ($page) => $page->component('Costs/Create'));
});

test('cost can be stored', function () {
    $land = Land::factory()->create();
    $season = LandSeason::factory()->create();

    $this->post(route('costs.store'), [
        'land_id' => $land->id,
        'land_season_id' => $season->id,
        'type' => 'أسمدة',
        'description' => 'سماد يوريا',
        'amount' => 5000,
        'date' => '2025-03-15',
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('costs.index'));

    expect(Cost::where('description', 'سماد يوريا')->exists())->toBeTrue();
});

test('cost validation fails with missing required fields', function () {
    $this->post(route('costs.store'), [])
        ->assertSessionHasErrors(['land_id', 'land_season_id', 'type', 'description', 'amount', 'date']);
});

test('cost show page renders', function () {
    $cost = Cost::factory()->create();

    $this->get(route('costs.show', $cost))
        ->assertInertia(fn ($page) => $page->component('Costs/Show'));
});

test('cost can be updated', function () {
    $cost = Cost::factory()->create();

    $this->put(route('costs.update', $cost), [
        'land_id' => $cost->land_id,
        'land_season_id' => $cost->land_season_id,
        'type' => $cost->type,
        'description' => 'وصف محدث',
        'amount' => 8000,
        'date' => $cost->date->format('Y-m-d'),
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('costs.index'));

    expect($cost->fresh()->description)->toBe('وصف محدث');
});

test('cost can be deleted', function () {
    $cost = Cost::factory()->create();

    $this->delete(route('costs.destroy', $cost))
        ->assertRedirect(route('costs.index'));

    expect(Cost::find($cost->id))->toBeNull();
});
