<?php

use App\Domains\Ledger\Models\LedgerEntry;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('index page renders', function () {
    LedgerEntry::factory()->count(3)->create();

    $this->get(route('ledger.index'))
        ->assertInertia(fn ($page) => $page->component('Ledger/Index'));
});
