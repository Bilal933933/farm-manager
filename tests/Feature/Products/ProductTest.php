<?php

use App\Domains\Products\Enums\ProductCategory;
use App\Domains\Products\Enums\ProductStatus;
use App\Domains\Products\Enums\ProductUnit;
use App\Domains\Products\Models\Product;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('index page renders', function () {
    Product::factory()->count(3)->create();

    $this->get(route('products.index'))
        ->assertInertia(fn ($page) => $page->component('Products/Index'));
});

test('create page renders', function () {
    $this->get(route('products.create'))
        ->assertInertia(fn ($page) => $page->component('Products/Create'));
});

test('product can be stored', function () {
    $this->post(route('products.store'), [
        'name' => 'سماد يوريا 46%',
        'category' => ProductCategory::Fertilizer->value,
        'unit' => ProductUnit::Bag->value,
        'status' => ProductStatus::Active->value,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('products.index'));

    expect(Product::where('name', 'سماد يوريا 46%')->exists())->toBeTrue();
});

test('product validation fails with missing fields', function () {
    $this->post(route('products.store'), [])
        ->assertSessionHasErrors(['name', 'category', 'unit', 'status']);
});

test('product show page renders', function () {
    $product = Product::factory()->create();

    $this->get(route('products.show', $product))
        ->assertInertia(fn ($page) => $page->component('Products/Show'));
});

test('product can be updated', function () {
    $product = Product::factory()->create();

    $this->put(route('products.update', $product), [
        'name' => 'سماد محدث',
        'category' => $product->category->value,
        'unit' => $product->unit->value,
        'status' => $product->status->value,
    ])->assertSessionHasNoErrors()
        ->assertRedirect(route('products.index'));

    expect($product->fresh()->name)->toBe('سماد محدث');
});

test('product can be deleted', function () {
    $product = Product::factory()->create();

    $this->delete(route('products.destroy', $product))
        ->assertRedirect(route('products.index'));

    expect(Product::find($product->id))->toBeNull();
});
