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
use App\Domains\Sales\Actions\CreateSale;
use Illuminate\Database\Seeder;

class LandsSeeder extends Seeder
{
    public function run(
        RecordHarvest $recordHarvest,
        CreateSale $createSale,
        CalculateSeasonFinancials $calculateSeasonFinancials,
    ): void {
        $dataDir = __DIR__.'/data';

        $landsData = json_decode(file_get_contents("$dataDir/lands.json"), true);
        $seasonsData = json_decode(file_get_contents("$dataDir/seasons.json"), true);
        $contractsData = json_decode(file_get_contents("$dataDir/contracts.json"), true);
        $costsData = json_decode(file_get_contents("$dataDir/costs.json"), true);
        $harvestsData = json_decode(file_get_contents("$dataDir/harvests.json"), true);
        $salesData = json_decode(file_get_contents("$dataDir/sales.json"), true);

        $cropByName = Crop::pluck('id', 'name');
        $partyByName = Party::pluck('id', 'name');

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
        foreach ($contractsData as $item) {
            LandContract::create([
                'land_id' => $landByRef[$item['land_ref']]->id,
                'party_id' => $partyByName[$item['party_name']] ?? null,
                'type' => $item['type'],
                'start_date' => $item['start_date'],
                'end_date' => $item['end_date'],
                'amount' => $item['amount'],
                'notes' => $item['notes'] ?? null,
            ]);
        }

        // ──────────────────────────────────────
        // 4. Costs (directly — skip Actions for speed)
        // ──────────────────────────────────────
        $costChunks = array_chunk($costsData, 100);
        foreach ($costChunks as $chunk) {
            $insert = [];
            foreach ($chunk as $item) {
                $season = $seasonByRef[$item['season_ref']] ?? null;
                if (! $season) {
                    continue;
                }
                $insert[] = [
                    'land_id' => $season->land_id,
                    'land_season_id' => $season->id,
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
        // 5. Harvests + Sales
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
                $partyId = $partyByName[$saleItem['party_name']] ?? null;
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
        // 6. Recalculate all season financials
        // ──────────────────────────────────────
        foreach ($seasonByRef as $season) {
            $calculateSeasonFinancials->forSeason($season);
        }
    }
}
