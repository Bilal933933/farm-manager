<?php

namespace Database\Factories\Domains\Sales\Models;

use App\Domains\Lands\Models\Harvest;
use App\Domains\Parties\Models\Party;
use App\Domains\Sales\Enums\SaleType;
use App\Domains\Sales\Models\Sale;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleFactory extends Factory
{
    protected $model = Sale::class;

    public function definition(): array
    {
        return [
            'harvest_id' => Harvest::factory(),
            'party_id' => Party::factory()->merchant(),
            'quantity' => fake()->randomFloat(2, 10, 500),
            'unit_price' => fake()->randomFloat(2, 100, 5000),
            'date' => fake()->date(),
            'payment_type' => fake()->randomElement(SaleType::cases())->value,
        ];
    }
}
