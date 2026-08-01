<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;

class CreateLandSeason
{
    public function execute(array $data): LandSeason
    {
        if (! empty($data['farmer_contract_id'])) {
            $contract = LandContract::find($data['farmer_contract_id']);

            if (! $contract) {
                throw new \InvalidArgumentException('عقد المزارعة المحدد غير موجود.');
            }

            if ($contract->type !== 'مزارع') {
                throw new \InvalidArgumentException('العقد المحدد ليس عقد مزارعة.');
            }

            if ($contract->land_id !== (int) ($data['land_id'] ?? 0)) {
                throw new \InvalidArgumentException('عقد المزارعة المحدد لا ينتمي إلى هذه الأرض.');
            }

            if (! empty($data['farmer_id']) && (int) $contract->party_id !== (int) $data['farmer_id']) {
                throw new \InvalidArgumentException('عقد المزارعة المحدد لا يخص المزارع المختار.');
            }
        }

        if (! empty($data['crop_id'])) {
            $existing = LandSeason::where('land_id', $data['land_id'])
                ->where('crop_id', $data['crop_id'])
                ->where(function ($q) use ($data) {
                    if (! empty($data['planting_date'])) {
                        $q->whereYear('planting_date', date('Y', strtotime($data['planting_date'])));
                    }
                })
                ->whereNull('deleted_at')
                ->exists();

            if ($existing) {
                throw new \InvalidArgumentException('يوجد موسم سابق لنفس المحصول في هذه الأرض ونفس العام.');
            }
        }

        if (($data['status'] ?? null) === SeasonStatus::Active->value) {
            $hasActive = LandSeason::where('land_id', $data['land_id'])
                ->where('status', SeasonStatus::Active)
                ->exists();

            if ($hasActive) {
                throw new \InvalidArgumentException('يوجد موسم نشط بالفعل لهذه الأرض.');
            }
        }

        return LandSeason::create($data);
    }
}
