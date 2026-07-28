<?php

namespace Database\Seeders;

use App\Domains\Crops\Models\Crop;
use App\Domains\Lands\Actions\CalculateSeasonFinancials;
use App\Domains\Lands\Actions\RecordHarvest;
use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Actions\RecordPayment;
use App\Domains\Products\Models\Product;
use App\Domains\Sales\Actions\CreateSale;
use Illuminate\Database\Seeder;

class LandsSeeder extends Seeder
{
    public function run(
        RecordHarvest $recordHarvest,
        CreateSale $createSale,
        RecordPayment $recordPayment,
        CalculateSeasonFinancials $calculateSeasonFinancials,
    ): void {
        $dataDir = __DIR__.'/data';

        $landsData = json_decode(file_get_contents("$dataDir/lands.json"), true);
        $seasonsData = json_decode(file_get_contents("$dataDir/seasons.json"), true);
        $contractsData = json_decode(file_get_contents("$dataDir/contracts.json"), true);
        $paymentsData = json_decode(file_get_contents("$dataDir/payments.json"), true);
        $costsData = json_decode(file_get_contents("$dataDir/costs.json"), true);
        $harvestsData = json_decode(file_get_contents("$dataDir/harvests.json"), true);
        $salesData = json_decode(file_get_contents("$dataDir/sales.json"), true);
        $partiesData = json_decode(file_get_contents("$dataDir/parties.json"), true);

        $cropByName = Crop::pluck('id', 'name');

        // Map party_ref → name
        $partyRefToName = [];
        foreach ($partiesData as $p) {
            $partyRefToName[$p['ref']] = $p['name'];
        }

        $partyByName = Party::pluck('id', 'name');

        // Map product names to IDs (for costs)
        $productByName = Product::pluck('id', 'name');

        // ──────────────────────────────────────
        // 1. Lands
        // ──────────────────────────────────────
        $landByRef = [];
        foreach ($landsData as $item) {
            $land = Land::create([
                'name' => $item['name'],
                'location' => $item['location'],
                'area' => $item['area'],
                'area_unit' => $item['area_unit'],
                'status' => $item['status'],
                'notes' => $item['notes'] ?? null,
            ]);
            $landByRef[$item['ref']] = $land;
        }

        // ──────────────────────────────────────
        // 2. Seasons
        // ──────────────────────────────────────
        $seasonByRef = [];
        foreach ($seasonsData as $item) {
            $cropId = $cropByName[$item['crop']] ?? null;

            $season = LandSeason::create([
                'land_id' => $landByRef[$item['land_ref']]->id,
                'crop_id' => $cropId,
                'cultivated_area' => $item['cultivated_area'],
                'crop' => $item['crop'],
                'planting_date' => $item['planting_date'],
                'harvest_date' => $item['harvest_date'],
                'expected_cost' => round($item['expected_cost'], 2),
                'status' => $item['status'],
            ]);
            $seasonByRef[$item['ref']] = $season;
        }

        // ──────────────────────────────────────
        // 3. Contracts
        // ──────────────────────────────────────
        $contractByRef = [];
        foreach ($contractsData as $item) {
            $partyName = $partyRefToName[$item['party_ref']] ?? null;
            $contract = LandContract::create([
                'land_id' => $landByRef[$item['land_ref']]->id,
                'party_id' => $partyName ? ($partyByName[$partyName] ?? null) : null,
                'type' => $item['type'],
                'start_date' => $item['start_date'],
                'end_date' => $item['end_date'],
                'amount' => $item['amount'],
                'notes' => $item['notes'] ?? null,
            ]);
            $contractByRef[$item['ref']] = $contract;
        }

        // ──────────────────────────────────────
        // 4. Payments (linked to contracts)
        // ──────────────────────────────────────
        foreach ($paymentsData as $item) {
            $partyName = $partyRefToName[$item['party_ref']] ?? null;
            $partyId = $partyName ? ($partyByName[$partyName] ?? null) : null;
            $contractId = ! empty($item['contract_ref']) ? ($contractByRef[$item['contract_ref']]?->id ?? null) : null;

            if (! $partyId) {
                continue;
            }

            $recordPayment->execute([
                'party_id' => $partyId,
                'contract_id' => $contractId,
                'type' => $item['type'],
                'date' => $item['date'],
                'amount' => $item['amount'],
                'notes' => $item['notes'] ?? null,
            ]);
        }

        // ──────────────────────────────────────
        // 5. Costs (directly — skip Actions for speed)
        // ──────────────────────────────────────
        $costChunks = array_chunk($costsData, 100);
        foreach ($costChunks as $chunk) {
            $insert = [];
            foreach ($chunk as $item) {
                $season = $seasonByRef[$item['season_ref']] ?? null;
                if (! $season) {
                    continue;
                }

                $cropId = null;
                if (! empty($item['crop_ref'])) {
                    $cropId = $cropByName[$item['crop_ref']] ?? null;
                }

                $productId = null;
                if (! empty($item['product_ref'])) {
                    $productId = $productByName[$item['product_ref']] ?? null;
                }

                $insert[] = [
                    'land_id' => $season->land_id,
                    'land_season_id' => $season->id,
                    'crop_id' => $cropId,
                    'product_id' => $productId,
                    'quantity' => $item['qty'] ?? null,
                    'type' => $item['type'],
                    'description' => $item['description'],
                    'amount' => $item['amount'],
                    'date' => $item['date'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            if ($insert) {
                Cost::insert($insert);
            }
        }

        // ──────────────────────────────────────
        // 6. Harvests + Sales
        // ──────────────────────────────────────
        foreach ($harvestsData as $item) {
            $season = $seasonByRef[$item['season_ref']] ?? null;
            if (! $season) {
                continue;
            }

            $harvest = $recordHarvest->execute([
                'land_season_id' => $season->id,
                'name' => $item['name'],
                'date' => $item['date'],
                'quantity' => $item['quantity'],
            ]);

            $harvestSales = array_filter($salesData, fn ($s) => $s['harvest_ref'] === $item['ref']);
            foreach ($harvestSales as $saleItem) {
                $partyName = $partyRefToName[$saleItem['party_ref']] ?? null;
                $partyId = $partyName ? ($partyByName[$partyName] ?? null) : null;
                if (! $partyId) {
                    continue;
                }

                $createSale->execute([
                    'harvest_id' => $harvest->id,
                    'party_id' => $partyId,
                    'quantity' => $saleItem['quantity'],
                    'unit_price' => $saleItem['unit_price'],
                    'date' => $saleItem['date'],
                    'payment_type' => $saleItem['payment_type'],
                ]);
            }
        }

        // ──────────────────────────────────────
        // 7. Assign farmers to seasons
        // ──────────────────────────────────────
        $farmerContract = $contractByRef['ctr_farmer_wadi'] ?? null;
        if ($farmerContract) {
            LandSeason::where('land_id', $landByRef['land_wadi']->id)
                ->update([
                    'farmer_id' => $farmerContract->party_id,
                    'farmer_contract_id' => $farmerContract->id,
                ]);
        }

        // ──────────────────────────────────────
        // 8. Recalculate all season financials
        // ──────────────────────────────────────
        foreach ($seasonByRef as $season) {
            $calculateSeasonFinancials->forSeason($season);
        }
    }
}
