<?php

namespace Database\Factories\Domains\Purchases\Models;

use App\Domains\Products\Models\Product;
use App\Domains\Purchases\Models\Purchase;
use App\Domains\Purchases\Models\PurchaseItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class PurchaseItemFactory extends Factory
{
    protected $model = PurchaseItem::class;

    public function definition(): array
    {
        return [
            'purchase_id' => Purchase::factory(),
            'product_id' => Product::factory(),
            'quantity' => fake()->randomFloat(2, 1, 100),
            'unit_price' => fake()->randomFloat(2, 10, 500),
        ];
    }
}
