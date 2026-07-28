<?php

namespace Database\Factories\Domains\Products\Models;

use App\Domains\Products\Enums\ProductCategory;
use App\Domains\Products\Enums\ProductStatus;
use App\Domains\Products\Enums\ProductUnit;
use App\Domains\Products\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['سماد يوريا', 'مبيد حشري', 'بذور بطيخ', 'مبيد فطريات', 'سماد نترات']),
            'category' => fake()->randomElement(ProductCategory::cases())->value,
            'unit' => fake()->randomElement(ProductUnit::cases())->value,
            'status' => ProductStatus::Active->value,
            'last_purchase_price' => fake()->randomFloat(2, 50, 500),
        ];
    }
}
