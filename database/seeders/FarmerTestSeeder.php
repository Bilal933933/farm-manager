<?php

namespace Database\Seeders;

use App\Domains\Lands\Actions\CalculateSeasonFinancials;
use App\Domains\Lands\Actions\CreateCost;
use App\Domains\Lands\Actions\RecordHarvest;
use App\Domains\Lands\Enums\CostType;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Parties\Enums\PartyCategory;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Actions\RecordPayment;
use App\Domains\Payments\Enums\PaymentType;
use App\Domains\Sales\Actions\CreateSale;
use Illuminate\Database\Seeder;

class FarmerTestSeeder extends Seeder
{
    public function run(
        RecordHarvest $recordHarvest,
        CreateSale $createSale,
        CreateCost $createCost,
        RecordPayment $recordPayment,
        CalculateSeasonFinancials $calculateSeasonFinancials,
    ): void {
        $farmer = Party::where('category', PartyCategory::Farmer->value)->first()
            ?? Party::factory()->create(['name' => 'مزارع اختباري', 'category' => PartyCategory::Farmer, 'type' => 'فرد']);

        $land1 = Land::where('name', 'أرض السلام')->first();
        $land2 = Land::where('name', 'أرض النيل')->first();
        $land3 = Land::where('name', 'مزرعة الوادي')->first();

        if (! $land1 || ! $land2 || ! $land3) {
            return;
        }

        // ──────────────────────────────────────
        // 1. Farmer contract (مزارع + نسبة 50%)
        // ──────────────────────────────────────
        $farmerContract = LandContract::create([
            'land_id' => $land1->id,
            'party_id' => $farmer->id,
            'type' => 'مزارع',
            'settlement_type' => 'نسبة',
            'share_percentage' => 50,
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'amount' => 0,
        ]);

        // ──────────────────────────────────────
        // 2. Three seasons with full farmer data
        // ──────────────────────────────────────
        $seeds = [
            [
                'land' => $land1,
                'crop' => 'بطيخ أحمر',
                'cultivated_area' => 10,
                'planting_date' => '2026-03-01',
                'harvest_date' => '2026-06-15',
                'status' => 'منتهي',
                'harvest_qty' => 200,
                'harvest_name' => 'حصاد البطيخ - أرض السلام',
                'sales' => [
                    ['party_name' => 'تاجر الخضار أحمد علي', 'qty' => 120, 'price' => 4500, 'payment' => 'نقدي'],
                    ['party_name' => 'سوق الجملة بكفر الشيخ', 'qty' => 80, 'price' => 4200, 'payment' => 'آجل'],
                ],
                'costs' => [
                    ['type' => CostType::Fertilizers, 'desc' => 'سماد يوريا 46%', 'amount' => 25000, 'borne_by' => 'مشترك'],
                    ['type' => CostType::Fertilizers, 'desc' => 'سماد نترات النشادر', 'amount' => 15000, 'borne_by' => 'مشترك'],
                    ['type' => CostType::Irrigation, 'desc' => 'فواتير ري', 'amount' => 8000, 'borne_by' => 'مشترك'],
                    ['type' => CostType::Labor, 'desc' => 'عمالة حصاد', 'amount' => 5000, 'borne_by' => 'مشترك'],
                    ['type' => CostType::Seeds, 'desc' => 'تقاوي بطيخ أحمر', 'amount' => 12000, 'borne_by' => 'مزارع'],
                    ['type' => CostType::Pesticides, 'desc' => 'مبيدات حشرية', 'amount' => 6000, 'borne_by' => 'مزارع'],
                    ['type' => CostType::Transport, 'desc' => 'نقل المحصول للسوق', 'amount' => 4000, 'borne_by' => 'مالك'],
                ],
                'advances' => [
                    ['amount' => 15000, 'date' => '2026-03-10'],
                    ['amount' => 5000, 'date' => '2026-05-01'],
                ],
            ],
            [
                'land' => $land2,
                'crop' => 'قمح صلب',
                'cultivated_area' => 15,
                'planting_date' => '2025-11-01',
                'harvest_date' => '2026-04-15',
                'status' => 'منتهي',
                'harvest_qty' => 350,
                'harvest_name' => 'حصاد القمح - أرض النيل',
                'sales' => [
                    ['party_name' => 'سوق الجملة بكفر الشيخ', 'qty' => 350, 'price' => 2200, 'payment' => 'نقدي'],
                ],
                'costs' => [
                    ['type' => CostType::Fertilizers, 'desc' => 'سماد يوريا', 'amount' => 18000, 'borne_by' => 'مشترك'],
                    ['type' => CostType::Irrigation, 'desc' => 'ري القمح', 'amount' => 6000, 'borne_by' => 'مشترك'],
                    ['type' => CostType::Seeds, 'desc' => 'تقاوي قمح', 'amount' => 15000, 'borne_by' => 'مزارع'],
                    ['type' => CostType::Pesticides, 'desc' => 'مبيدات أعشاب', 'amount' => 4000, 'borne_by' => 'مزارع'],
                    ['type' => CostType::Labor, 'desc' => 'عمالة حصاد', 'amount' => 8000, 'borne_by' => 'مشترك'],
                    ['type' => CostType::Transport, 'desc' => 'نقل القمح للصومعة', 'amount' => 5000, 'borne_by' => 'مالك'],
                    ['type' => CostType::Harvest, 'desc' => 'حصادة آلية', 'amount' => 7000, 'borne_by' => 'مالك'],
                ],
                'advances' => [
                    ['amount' => 8000, 'date' => '2025-11-15'],
                ],
            ],
            [
                'land' => $land3,
                'crop' => 'أرز عريض',
                'cultivated_area' => 20,
                'planting_date' => '2026-05-15',
                'harvest_date' => '2026-09-20',
                'status' => 'نشط',
                'harvest_qty' => 400,
                'harvest_name' => 'حصاد الأرز - مزرعة الوادي',
                'sales' => [
                    ['party_name' => 'تاجر الخضار أحمد علي', 'qty' => 400, 'price' => 3500, 'payment' => 'آجل'],
                ],
                'costs' => [
                    ['type' => CostType::Fertilizers, 'desc' => 'سماد بلدي', 'amount' => 30000, 'borne_by' => 'مشترك'],
                    ['type' => CostType::Seeds, 'desc' => 'تقاوي أرز', 'amount' => 20000, 'borne_by' => 'مزارع'],
                    ['type' => CostType::Irrigation, 'desc' => 'ري الأرز', 'amount' => 12000, 'borne_by' => 'مشترك'],
                    ['type' => CostType::Pesticides, 'desc' => 'مبيدات أرز', 'amount' => 8000, 'borne_by' => 'مزارع'],
                    ['type' => CostType::Labor, 'desc' => 'عمالة زراعة', 'amount' => 10000, 'borne_by' => 'مشترك'],
                    ['type' => CostType::Harvest, 'desc' => 'حصادة أرز', 'amount' => 9000, 'borne_by' => 'مالك'],
                ],
                'advances' => [
                    ['amount' => 12000, 'date' => '2026-06-01'],
                    ['amount' => 8000, 'date' => '2026-07-01'],
                    ['amount' => 5000, 'date' => '2026-08-01'],
                ],
            ],
        ];

        foreach ($seeds as $seed) {
            $season = LandSeason::create([
                'land_id' => $seed['land']->id,
                'crop' => $seed['crop'],
                'cultivated_area' => $seed['cultivated_area'],
                'planting_date' => $seed['planting_date'],
                'harvest_date' => $seed['harvest_date'],
                'status' => $seed['status'],
                'farmer_id' => $farmer->id,
                'farmer_contract_id' => $farmerContract->id,
            ]);

            // Costs per season
            foreach ($seed['costs'] as $c) {
                $createCost->execute([
                    'land_id' => $seed['land']->id,
                    'land_season_id' => $season->id,
                    'type' => $c['type']->value,
                    'description' => $c['desc'],
                    'amount' => $c['amount'],
                    'date' => $season->planting_date->format('Y-m-d'),
                    'borne_by' => $c['borne_by'],
                ]);
            }

            // Harvest
            $harvest = $recordHarvest->execute([
                'land_season_id' => $season->id,
                'name' => $seed['harvest_name'],
                'date' => $season->harvest_date->format('Y-m-d'),
                'quantity' => $seed['harvest_qty'],
            ]);

            // Sales
            foreach ($seed['sales'] as $s) {
                $buyer = Party::where('name', $s['party_name'])->first();
                if ($buyer) {
                    $createSale->execute([
                        'harvest_id' => $harvest->id,
                        'party_id' => $buyer->id,
                        'quantity' => $s['qty'],
                        'unit_price' => $s['price'],
                        'date' => $seed['harvest_date'],
                        'payment_type' => $s['payment'],
                    ]);
                }
            }

            // Advance payments linked to season
            foreach ($seed['advances'] as $adv) {
                $recordPayment->execute([
                    'party_id' => $farmer->id,
                    'type' => PaymentType::Advance->value,
                    'date' => $adv['date'],
                    'amount' => $adv['amount'],
                    'land_season_id' => $season->id,
                    'notes' => "سلفة للمزارع - {$seed['crop']} - {$seed['land']->name}",
                ]);
            }

            $calculateSeasonFinancials->forSeason($season);
        }
    }
}
