<?php

namespace Database\Seeders;

use App\Domains\Crops\Models\Crop;
use App\Domains\Lands\Enums\AreaUnit;
use App\Domains\Lands\Enums\LandStatus;
use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandSeason;
use Illuminate\Database\Seeder;

class LandsSeeder extends Seeder
{
    public function run(): void
    {
        $land1 = Land::create([
            'name' => 'أرض السلام',
            'location' => 'كفر الشيخ - مركز بيلا - ناحية السلام',
            'area' => 12,
            'area_unit' => AreaUnit::Donum->value,
            'status' => LandStatus::Active->value,
            'notes' => 'أرض خصبة مجهزة بالري المحوري',
        ]);

        $land2 = Land::create([
            'name' => 'أرض الترعة',
            'location' => 'كفر الشيخ - مركز الرياض - بجوار ترعة النوبارية',
            'area' => 8,
            'area_unit' => AreaUnit::Donum->value,
            'status' => LandStatus::Active->value,
            'notes' => 'أرض حديثة الري بالغمر',
        ]);

        $watermelon = Crop::where('name', 'بطيخ أحمر')->first();

        LandSeason::create([
            'land_id' => $land1->id,
            'crop_id' => $watermelon?->id,
            'cultivated_area' => 10,
            'crop' => 'بطيخ أحمر',
            'planting_date' => '2026-03-01',
            'harvest_date' => '2026-06-15',
            'expected_cost' => 150000,
            'actual_cost' => null,
            'status' => SeasonStatus::Active->value,
            'notes' => 'موسم صيفي بطيخ أحمر - المساحة المزروعة 10 دنم',
        ]);
    }
}
