<?php

use App\Domains\Crops\Models\Crop;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('index page renders', function () {
    Crop::factory()->count(3)->create();

    $this->get(route('crops.index'))
        ->assertInertia(fn ($page) => $page->component('Crops/Index'));
});

test('create page renders', function () {
    $this->get(route('crops.create'))
        ->assertInertia(fn ($page) => $page->component('Crops/Create'));
});

test('crop can be stored', function () {
    $this->post(route('crops.store'), [
        'name' => 'بطيخ أحمر',
        'category' => 'خضروات',
        'unit' => 'طن',
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('crops.index'));

    expect(Crop::where('name', 'بطيخ أحمر')->exists())->toBeTrue();
});

test('crop validation fails with missing fields', function () {
    $this->post(route('crops.store'), [])
        ->assertSessionHasErrors(['name', 'category', 'unit']);
});

test('crop show page renders', function () {
    $crop = Crop::factory()->create();

    $this->get(route('crops.show', $crop))
        ->assertInertia(fn ($page) => $page->component('Crops/Show'));
});

test('edit page renders', function () {
    $crop = Crop::factory()->create();

    $this->get(route('crops.edit', $crop))
        ->assertInertia(fn ($page) => $page->component('Crops/Edit'));
});

test('crop can be updated', function () {
    $crop = Crop::factory()->create();

    $this->put(route('crops.update', $crop), [
        'name' => 'بطيخ معدل',
        'category' => $crop->category->value,
        'unit' => $crop->unit->value,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('crops.index'));

    expect($crop->fresh()->name)->toBe('بطيخ معدل');
});

test('crop can be deleted', function () {
    $crop = Crop::factory()->create();

    $this->delete(route('crops.destroy', $crop))
        ->assertRedirect(route('crops.index'));

    expect(Crop::find($crop->id))->toBeNull();
});
