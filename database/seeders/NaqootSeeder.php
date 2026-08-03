<?php

namespace Database\Seeders;

use App\Domains\Naqoot\Enums\NaqootDirection;
use App\Domains\Naqoot\Models\Naqoot;
use Illuminate\Database\Seeder;

class NaqootSeeder extends Seeder
{
    public function run(): void
    {
        $entries = [
            // لنا - استلمنا نقوطاً في فرح العائلة
            ['name' => 'محمد أحمد', 'date' => '2026-01-15', 'amount' => 1000, 'direction' => NaqootDirection::ForUs],
            ['name' => 'سالم البلوشي', 'date' => '2026-01-15', 'amount' => 2000, 'direction' => NaqootDirection::ForUs],
            ['name' => 'خالد حسن', 'date' => '2026-01-16', 'amount' => 1500, 'direction' => NaqootDirection::ForUs],
            ['name' => 'عبدالله سعيد', 'date' => '2026-01-16', 'amount' => 1000, 'direction' => NaqootDirection::ForUs],

            // علينا (دفعنا نقوطاً في أفراح الآخرين)
            ['name' => 'شقيق خالد', 'date' => '2026-03-10', 'amount' => 1500, 'direction' => NaqootDirection::OnUs],
            ['name' => 'ابن عم عبدالعزيز', 'date' => '2026-04-22', 'amount' => 2000, 'direction' => NaqootDirection::OnUs],
            ['name' => 'جارنا فهد', 'date' => '2026-06-05', 'amount' => 1000, 'direction' => NaqootDirection::OnUs],
            ['name' => 'صديق العائلة يوسف', 'date' => '2026-07-18', 'amount' => 1200, 'direction' => NaqootDirection::OnUs],
        ];

        foreach ($entries as $entry) {
            Naqoot::create($entry);
        }
    }
}
