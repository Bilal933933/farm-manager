<?php

namespace Database\Seeders;

use App\Domains\Crops\Enums\CropCategory;
use App\Domains\Crops\Enums\CropSeason;
use App\Domains\Crops\Enums\CropUnit;
use App\Domains\Crops\Models\Crop;
use App\Domains\Products\Enums\ProductCategory;
use App\Domains\Products\Enums\ProductStatus;
use App\Domains\Products\Enums\ProductUnit;
use App\Domains\Products\Models\Product;
use Illuminate\Database\Seeder;

class LookupSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'code' => 'F001',
            'name' => 'يوريا 46%',
            'category' => ProductCategory::Fertilizer->value,
            'unit' => ProductUnit::Bag->value,
            'status' => ProductStatus::Active->value,
            'display_order' => 1,
        ]);

        Product::create([
            'code' => 'F002',
            'name' => 'نترات النشادر',
            'category' => ProductCategory::Fertilizer->value,
            'unit' => ProductUnit::Bag->value,
            'status' => ProductStatus::Active->value,
            'display_order' => 2,
        ]);

        Product::create([
            'code' => 'F003',
            'name' => 'سماد مركب 19-19-19',
            'category' => ProductCategory::Fertilizer->value,
            'unit' => ProductUnit::Bag->value,
            'status' => ProductStatus::Active->value,
            'display_order' => 3,
        ]);

        Product::create([
            'code' => 'I001',
            'name' => 'خرطوم ري بالتنقيط',
            'category' => ProductCategory::Irrigation->value,
            'unit' => ProductUnit::Roll->value,
            'status' => ProductStatus::Active->value,
            'display_order' => 4,
        ]);

        Product::create([
            'code' => 'S001',
            'name' => 'بذور بطيخ أحمر',
            'category' => ProductCategory::Seeds->value,
            'unit' => ProductUnit::Box->value,
            'status' => ProductStatus::Active->value,
            'display_order' => 5,
        ]);

        Crop::create([
            'name' => 'بطيخ أحمر',
            'category' => CropCategory::Fruits->value,
            'unit' => CropUnit::Ton->value,
            'typical_season' => CropSeason::Summer->value,
            'notes' => 'صنف بريميوم',
        ]);

        Crop::create([
            'name' => 'أرز عريض',
            'category' => CropCategory::FieldCrops->value,
            'unit' => CropUnit::Ton->value,
            'typical_season' => CropSeason::Nile->value,
            'notes' => null,
        ]);

        Crop::create([
            'name' => 'قمح صلب',
            'category' => CropCategory::FieldCrops->value,
            'unit' => CropUnit::Ton->value,
            'typical_season' => CropSeason::Winter->value,
            'notes' => null,
        ]);
    }
}
