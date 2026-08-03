<?php

namespace Database\Factories\Domains\Naqoot\Models;

use App\Domains\Naqoot\Enums\NaqootDirection;
use App\Domains\Naqoot\Models\Naqoot;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Naqoot>
 */
class NaqootFactory extends Factory
{
    protected $model = Naqoot::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'date' => fake()->date(),
            'amount' => fake()->randomFloat(2, 50, 5000),
            'direction' => fake()->randomElement(NaqootDirection::cases())->value,
            'notes' => fake()->sentence(),
        ];
    }

    public function forUs(): static
    {
        return $this->state(fn (array $attributes) => [
            'direction' => NaqootDirection::ForUs->value,
        ]);
    }

    public function onUs(): static
    {
        return $this->state(fn (array $attributes) => [
            'direction' => NaqootDirection::OnUs->value,
        ]);
    }
}
