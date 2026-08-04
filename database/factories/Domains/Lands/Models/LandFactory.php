<?php

namespace Database\Factories\Domains\Lands\Models;

use App\Domains\Lands\Enums\AreaUnit;
use App\Domains\Lands\Enums\LandStatus;
use App\Domains\Lands\Models\Land;
use Illuminate\Database\Eloquent\Factories\Factory;

class LandFactory extends Factory
{
    protected $model = Land::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->company().' مزرعة',
            'location' => fake()->address(),
            'area' => fake()->randomFloat(2, 5, 50),
            'area_unit' => fake()->randomElement([AreaUnit::Faddan->value, AreaUnit::Hectare->value]),
            'status' => LandStatus::Active->value,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => LandStatus::Inactive->value,
        ]);
    }
}
