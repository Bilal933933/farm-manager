<?php

namespace Database\Factories\Domains\Lands\Models;

use App\Domains\Crops\Models\Crop;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandSeason;
use Illuminate\Database\Eloquent\Factories\Factory;

class LandSeasonFactory extends Factory
{
    protected $model = LandSeason::class;

    public function definition(): array
    {
        $year = fake()->numberBetween(2024, 2025);
        $plantingDate = "{$year}-03-01";
        $harvestDate = "{$year}-06-15";

        return [
            'land_id' => Land::factory(),
            'crop_id' => Crop::factory(),
            'cultivated_area' => fake()->randomFloat(2, 5, 30),
            'planting_date' => $plantingDate,
            'harvest_date' => $harvestDate,
            'expected_cost' => fake()->randomFloat(2, 50000, 200000),
            'status' => fake()->randomElement(['نشط', 'منتهي']),
        ];
    }
}
