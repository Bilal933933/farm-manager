<?php

use App\Domains\Parties\Enums\PartyCategory;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Enums\PaymentType;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

// ─── Party CRUD with Category ───────────────────────────────

test('party can be created with a category', function () {
    $this->post(route('parties.store'), [
        'name' => 'طرف اختبار',
        'type' => 'فرد',
        'category' => PartyCategory::Lessor->value,
        'phone' => '01000000000',
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('parties.index'));

    $party = Party::where('name', 'طرف اختبار')->first();

    expect($party)->not->toBeNull()
        ->and($party->category->value)->toBe(PartyCategory::Lessor->value);
});

test('party can be created without a category', function () {
    $this->post(route('parties.store'), [
        'name' => 'طرف بدون تصنيف',
        'type' => 'شركة',
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('parties.index'));

    $party = Party::where('name', 'طرف بدون تصنيف')->first();

    expect($party->category)->toBeNull();
});

test('party category can be updated', function () {
    $party = Party::factory()->lessor()->create();

    $this->put(route('parties.update', $party), [
        'name' => $party->name,
        'type' => $party->type,
        'category' => PartyCategory::Merchant->value,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('parties.index'));

    expect($party->fresh()->category->value)->toBe(PartyCategory::Merchant->value);
});

test('party category can be removed on update', function () {
    $party = Party::factory()->lessor()->create();

    $this->put(route('parties.update', $party), [
        'name' => $party->name,
        'type' => $party->type,
        'category' => '',
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('parties.index'));

    expect($party->fresh()->category)->toBeNull();
});

test('invalid party category is rejected', function () {
    $this->post(route('parties.store'), [
        'name' => 'طرف خاطئ',
        'type' => 'فرد',
        'category' => 'تصنيف وهمي',
    ])->assertSessionHasErrors('category');
});

// ─── Payment Type Validation Against Category ───────────────

test('payment type "قبض" is rejected for lessor party', function () {
    $party = Party::factory()->lessor()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Receipt->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ])->assertSessionHasErrors('type');
});

test('payment type "دفع" is allowed for lessor party', function () {
    $party = Party::factory()->lessor()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Payment->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ]);

    expect(session()->has('errors'))->toBeFalse();
});

test('payment type "سلف" is allowed for lessor party', function () {
    $party = Party::factory()->lessor()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Advance->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ]);

    expect(session()->has('errors'))->toBeFalse();
});

test('payment type "دفع" is rejected for merchant party', function () {
    $party = Party::factory()->merchant()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Payment->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ])->assertSessionHasErrors('type');
});

test('payment type "قبض" is allowed for merchant party', function () {
    $party = Party::factory()->merchant()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Receipt->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ]);

    expect(session()->has('errors'))->toBeFalse();
});

test('payment type "قبض" is allowed for lessee party', function () {
    $party = Party::factory()->lessee()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Receipt->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ]);

    expect(session()->has('errors'))->toBeFalse();
});

test('payment type "دفع" is rejected for lessee party', function () {
    $party = Party::factory()->lessee()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Payment->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ])->assertSessionHasErrors('type');
});

test('payment type "دفع" is allowed for supplier party', function () {
    $party = Party::factory()->supplier()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Payment->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ]);

    expect(session()->has('errors'))->toBeFalse();
});

test('payment type "قبض" is rejected for supplier party', function () {
    $party = Party::factory()->supplier()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Receipt->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ])->assertSessionHasErrors('type');
});

test('payment type "دفع" is allowed for farmer party', function () {
    $party = Party::factory()->farmer()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Payment->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ]);

    expect(session()->has('errors'))->toBeFalse();
});

test('payment type "قبض" is rejected for farmer party', function () {
    $party = Party::factory()->farmer()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Receipt->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ])->assertSessionHasErrors('type');
});

test('any payment type is allowed for party without category', function () {
    $party = Party::factory()->withoutCategory()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Payment->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ]);

    expect(session()->has('errors'))->toBeFalse();
});

// ─── Amanat (deposit holders) Payment Type Validation ──────

test('payment type "دفع" is allowed for amanat party', function () {
    $party = Party::factory()->amanat()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Payment->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ]);

    expect(session()->has('errors'))->toBeFalse();
});

test('payment type "قبض" is allowed for amanat party', function () {
    $party = Party::factory()->amanat()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Receipt->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ]);

    expect(session()->has('errors'))->toBeFalse();
});

test('payment type "سلف" is rejected for amanat party', function () {
    $party = Party::factory()->amanat()->create();

    $this->post(route('payments.store'), [
        'party_id' => $party->id,
        'type' => PaymentType::Advance->value,
        'date' => '2026-01-01',
        'amount' => '1000',
    ])->assertSessionHasErrors('type');
});

// ─── Purchase Validation Against Category ───────────────────

test('purchase is rejected for non-supplier party', function () {
    $party = Party::factory()->merchant()->create();

    $this->post(route('purchases.store'), [
        'party_id' => $party->id,
        'date' => '2026-01-01',
        'payment_type' => 'نقدي',
        'items' => [
            ['product_id' => 1, 'quantity' => 10, 'unit_price' => 50],
        ],
    ])->assertSessionHasErrors('party_id');
});

// ─── Sale Validation Against Category ───────────────────────

test('sale is rejected for non-merchant party', function () {
    $party = Party::factory()->supplier()->create();

    $this->post(route('sales.store'), [
        'harvest_id' => 1,
        'party_id' => $party->id,
        'quantity' => 100,
        'unit_price' => 50,
        'date' => '2026-01-01',
        'payment_type' => 'نقدي',
    ])->assertSessionHasErrors('party_id');
});

// ─── Party Show Page Contains Category ──────────────────────

test('party show page displays category', function () {
    $party = Party::factory()->lessor()->create();

    $this->get(route('parties.show', $party))
        ->assertInertia(fn ($page) => $page
            ->component('Parties/Show')
            ->where('party.category', PartyCategory::Lessor->value)
        );
});

test('party index page includes category in list', function () {
    Party::factory()->merchant()->create();

    $this->get(route('parties.index'))
        ->assertInertia(fn ($page) => $page
            ->component('Parties/Index')
            ->has('parties')
        );
});
