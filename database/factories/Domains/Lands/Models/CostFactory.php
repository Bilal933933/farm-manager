<?php

namespace Database\Factories\Domains\Lands\Models;

use App\Domains\Crops\Models\Crop;
use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandSeason;
use Illuminate\Database\Eloquent\Factories\Factory;

class CostFactory extends Factory
{
    protected $model = Cost::class;

    public function definition(): array
    {
        return [
            'land_id' => Land::factory(),
            'land_season_id' => LandSeason::factory(),
            'crop_id' => Crop::factory(),
            'type' => fake()->randomElement(['أسمدة', 'مبيدات', 'عمالة', 'ري', 'بذور']),
            'description' => fake()->sentence(3),
            'amount' => fake()->randomFloat(2, 500, 50000),
            'date' => fake()->date(),
        ];
    }
}
