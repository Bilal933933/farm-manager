<?php

use App\Domains\Lands\Models\Land;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('inertia xhr validation failure returns 422 json instead of redirect', function () {
    $land = Land::factory()->create();

    // Mimics the browser bundle: X-Inertia XHR with browser-default Accept.
    $this->withHeaders([
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
        'Accept' => 'text/html,application/xhtml+xml',
    ])->post(route('lands.seasons.store'), ['land_id' => $land->id])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['planting_date']);
});

test('classic validation failure still redirects with session errors', function () {
    $land = Land::factory()->create();

    $this->post(route('lands.seasons.store'), ['land_id' => $land->id])
        ->assertRedirect()
        ->assertSessionHasErrors(['planting_date']);
});
