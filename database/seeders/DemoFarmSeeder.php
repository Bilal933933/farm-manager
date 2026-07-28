<?php

namespace Database\Seeders;

use App\Domains\Lands\Actions\RecordHarvest;
use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Parties\Enums\PartyCategory;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Actions\RecordPayment;
use App\Domains\Products\Models\Product;
use App\Domains\Purchases\Actions\CreatePurchase;
use App\Domains\Sales\Actions\CreateSale;
use Illuminate\Database\Seeder;

class DemoFarmSeeder extends Seeder
{
    public function run(
        CreatePurchase $createPurchase,
        RecordPayment $recordPayment,
        RecordHarvest $recordHarvest,
        CreateSale $createSale,
    ): void {
        // ---------------------------------------------------------------
        // 1. شراء مستلزمات من مؤسسة الريان (50 شيكارة يوريا + 20 شيكارة نترات)
        // ---------------------------------------------------------------
        $supplier = Party::where('name', 'مؤسسة الريان للأسمدة')->first();
        $urea = Product::where('name', 'يوريا 46%')->first();
        $nitrate = Product::where('name', 'نترات النشادر')->first();

        $purchase = $createPurchase->execute([
            'party_id' => $supplier->id,
            'date' => '2026-03-05',
            'payment_type' => 'آجل',
            'notes' => 'مستلزمات موسم البطيخ الصيفي',
            'items' => [
                [
                    'product_id' => $urea->id,
                    'quantity' => 50,
                    'unit_price' => 700,
                ],
                [
                    'product_id' => $nitrate->id,
                    'quantity' => 20,
                    'unit_price' => 600,
                ],
            ],
        ]);

        // ---------------------------------------------------------------
        // 2. تسجيل دفعة للمورد (5000 ج)
        // ---------------------------------------------------------------
        $recordPayment->execute([
            'party_id' => $supplier->id,
            'type' => 'دفع',
            'date' => '2026-03-10',
            'amount' => 5000,
            'notes' => 'عربون على مستلزمات موسم البطيخ',
        ]);

        // ---------------------------------------------------------------
        // 3. تسجيل حصاد (230 طن بطيخ)
        // ---------------------------------------------------------------
        $season = LandSeason::with('land')
            ->whereHas('land', fn ($q) => $q->where('name', 'أرض السلام'))
            ->first();

        $farmer = Party::where('category', PartyCategory::Farmer->value)->first();
        $farmerContract = LandContract::where('type', 'مزارع')->first();
        if ($farmer && $season) {
            $season->update([
                'farmer_id' => $farmer->id,
                'farmer_contract_id' => $farmerContract?->id,
            ]);
        }

        $harvest = $recordHarvest->execute([
            'land_season_id' => $season->id,
            'date' => '2026-06-20',
            'name' => 'حصاد البطيخ الأحمر - الدورة الصيفية',
            'quantity' => 230,
            'notes' => 'بطيخ أحمر درجة أولى',
        ]);

        // ---------------------------------------------------------------
        // 4. بيع 100 طن لسوق الجملة
        // ---------------------------------------------------------------
        $customer = Party::where('name', 'سوق الجملة بكفر الشيخ')->first();

        $createSale->execute([
            'harvest_id' => $harvest->id,
            'party_id' => $customer->id,
            'quantity' => 100,
            'unit_price' => 4500,
            'date' => '2026-06-22',
            'payment_type' => 'آجل',
            'notes' => 'بيع بطيخ أحمر لسوق الجملة - آجل',
        ]);

        // ---------------------------------------------------------------
        // 5. بيع 80 طن لتاجر الخضار أحمد
        // ---------------------------------------------------------------
        $trader = Party::where('name', 'تاجر الخضار أحمد علي')->first();

        $createSale->execute([
            'harvest_id' => $harvest->id,
            'party_id' => $trader->id,
            'quantity' => 80,
            'unit_price' => 4800,
            'date' => '2026-06-25',
            'payment_type' => 'نقدي',
            'notes' => 'بيع بطيخ أحمر نقدي لتاجر الخضار',
        ]);

        // ---------------------------------------------------------------
        // 6. تسجيل إيصال قبض من سوق الجملة (200000 ج)
        // ---------------------------------------------------------------
        $recordPayment->execute([
            'party_id' => $customer->id,
            'type' => 'قبض',
            'date' => '2026-07-01',
            'amount' => 200000,
            'notes' => 'دفعة من سوق الجملة مقابل البيع الآجل',
        ]);
    }
}
