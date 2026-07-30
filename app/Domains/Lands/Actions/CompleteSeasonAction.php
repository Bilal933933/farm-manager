<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Payments\Enums\PaymentType;
use App\Domains\Payments\Models\Payment;
use App\Domains\Sales\Models\Sale;
use Illuminate\Support\Facades\DB;

class CompleteSeasonAction
{
    public function execute(LandSeason $season): LandSeason
    {
        if ($season->status === SeasonStatus::Completed) {
            throw new \RuntimeException('الموسم مغلق بالفعل.');
        }

        if ($season->status === SeasonStatus::Cancelled) {
            throw new \RuntimeException('لا يمكن إغلاق موسم ملغي.');
        }

        if ($season->status === SeasonStatus::Upcoming) {
            throw new \RuntimeException('لا يمكن إغلاق موسم لم يبدأ بعد.');
        }

        $this->ensureNoIncompleteHarvests($season);

        $this->ensureAdvancesHandled($season);

        DB::transaction(function () use ($season) {
            $season->loadMissing(['harvests']);

            $harvestIds = $season->harvests->pluck('id');
            $totalSales = (float) Sale::whereIn('harvest_id', $harvestIds)
                ->sum(DB::raw('quantity * unit_price'));
            $totalCost = (float) Cost::where('land_season_id', $season->id)
                ->sum('amount');
            $profit = $totalSales - $totalCost;

            $season->update([
                'actual_cost' => $totalCost,
                'actual_revenue' => $totalSales,
                'actual_profit' => $profit,
                'status' => SeasonStatus::Completed,
                'completed_at' => now(),
            ]);
        });

        return $season->fresh();
    }

    private function ensureNoIncompleteHarvests(LandSeason $season): void
    {
        $season->loadMissing(['harvests.sales']);

        foreach ($season->harvests as $harvest) {
            $soldQty = (float) $harvest->sales->sum('quantity');

            if ($soldQty < (float) $harvest->quantity) {
                $remaining = (float) $harvest->quantity - $soldQty;

                throw new \RuntimeException(
                    sprintf('لا يمكن إغلاق الموسم. يوجد حصاد "%s" بمتبقي %.2f من الكمية غير مباعة.', $harvest->name ?? 'بدون اسم', $remaining)
                );
            }
        }
    }

    private function ensureAdvancesHandled(LandSeason $season): void
    {
        $advances = Payment::where('land_season_id', $season->id)
            ->where('type', PaymentType::Advance)
            ->get();

        if ($advances->isEmpty()) {
            return;
        }

        if (! $season->farmer_contract_id) {
            $total = (float) $advances->sum('amount');

            throw new \RuntimeException(
                sprintf('لا يمكن إغلاق الموسم. يوجد سلف بقيمة %.2f مرتبطة بالموسم بدون عقد مزارعة لتسويتها.', $total)
            );
        }
    }
}
