<?php

namespace Database\Factories\Domains\Lands\Models;

use App\Domains\Lands\Models\Harvest;
use App\Domains\Lands\Models\LandSeason;
use Illuminate\Database\Eloquent\Factories\Factory;

class HarvestFactory extends Factory
{
    protected $model = Harvest::class;

    public function definition(): array
    {
        return [
            'land_season_id' => LandSeason::factory(),
            'name' => 'حصاد '.fake()->word(),
            'date' => fake()->date(),
            'quantity' => fake()->randomFloat(2, 100, 1000),
        ];
    }
}
