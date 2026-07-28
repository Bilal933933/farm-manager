<?php

namespace Database\Factories\Domains\StockMovements\Models;

use App\Domains\Products\Models\Product;
use App\Domains\StockMovements\Enums\MovementReason;
use App\Domains\StockMovements\Enums\MovementType;
use App\Domains\StockMovements\Models\StockMovement;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockMovementFactory extends Factory
{
    protected $model = StockMovement::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'type' => fake()->randomElement(MovementType::cases())->value,
            'reason' => fake()->randomElement(MovementReason::cases())->value,
            'quantity' => fake()->randomFloat(2, 1, 500),
            'movement_date' => fake()->date(),
        ];
    }

    public function inbound(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => MovementType::Inbound->value,
        ]);
    }

    public function outbound(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => MovementType::Outbound->value,
        ]);
    }
}
