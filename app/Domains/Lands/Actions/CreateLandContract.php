<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\LandContract;

class CreateLandContract
{
    public function execute(array $data): LandContract
    {
        $data = $this->normalize($data);

        return LandContract::create($data);
    }

    private function normalize(array $data): array
    {
        foreach ($data as $key => $value) {
            $data[$key] = $value === '' ? null : $value;
        }

        $data['amount'] = $data['amount'] ?? 0;

        return $data;
    }
}
