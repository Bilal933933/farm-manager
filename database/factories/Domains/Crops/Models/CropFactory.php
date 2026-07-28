<?php

namespace Database\Factories\Domains\Crops\Models;

use App\Domains\Crops\Enums\CropCategory;
use App\Domains\Crops\Enums\CropSeason;
use App\Domains\Crops\Enums\CropUnit;
use App\Domains\Crops\Models\Crop;
use Illuminate\Database\Eloquent\Factories\Factory;

class CropFactory extends Factory
{
    protected $model = Crop::class;

    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['بطيخ أحمر', 'قمح صلب', 'ذرة صفراء', 'برسيم', 'فول سوداني']),
            'category' => fake()->randomElement(CropCategory::cases())->value,
            'unit' => fake()->randomElement(CropUnit::cases())->value,
            'typical_season' => fake()->randomElement(CropSeason::cases())->value,
        ];
    }
}
