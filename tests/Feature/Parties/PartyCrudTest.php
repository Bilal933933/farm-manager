<?php

use App\Domains\Lands\Models\LandContract;
use App\Domains\Parties\Models\Party;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('index page renders', function () {
    Party::factory()->count(3)->create();

    $this->get(route('parties.index'))
        ->assertInertia(fn ($page) => $page->component('Parties/Index'));
});

test('create page renders', function () {
    $this->get(route('parties.create'))
        ->assertInertia(fn ($page) => $page->component('Parties/Create'));
});

test('party can be stored', function () {
    $this->post(route('parties.store'), [
        'name' => 'طرف اختبار كامل',
        'type' => 'فرد',
        'phone' => '01000000000',
        'email' => 'test@example.com',
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('parties.index'));

    expect(Party::where('name', 'طرف اختبار كامل')->exists())->toBeTrue();
});

test('party validation fails with missing fields', function () {
    $this->post(route('parties.store'), [])
        ->assertSessionHasErrors(['name', 'type']);
});

test('party show page renders', function () {
    $party = Party::factory()->create();

    $this->get(route('parties.show', $party))
        ->assertInertia(fn ($page) => $page
            ->component('Parties/Show')
            ->where('party.id', $party->id)
        );
});

test('edit page renders', function () {
    $party = Party::factory()->create();

    $this->get(route('parties.edit', $party))
        ->assertInertia(fn ($page) => $page->component('Parties/Edit'));
});

test('party can be updated', function () {
    $party = Party::factory()->create();

    $this->put(route('parties.update', $party), [
        'name' => 'اسم محدث',
        'type' => $party->type,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('parties.index'));

    expect($party->fresh()->name)->toBe('اسم محدث');
});

test('party can be deleted when it has no contracts', function () {
    $party = Party::factory()->create();

    $this->delete(route('parties.destroy', $party))
        ->assertRedirect(route('parties.index'));

    expect(Party::find($party->id))->toBeNull();
});

test('party cannot be deleted when it has contracts', function () {
    $party = Party::factory()->create();
    LandContract::factory()->create(['party_id' => $party->id]);

    $this->delete(route('parties.destroy', $party))
        ->assertRedirect(route('parties.index'))
        ->assertSessionMissing('errors');

    expect(Party::find($party->id))->not->toBeNull();
});
