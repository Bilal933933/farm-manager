<?php

namespace App\Domains\Lands\Requests;

use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Parties\Enums\PartyCategory;
use App\Domains\Parties\Models\Party;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLandSeasonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'land_id' => ['required', 'exists:lands,id'],
            'crop_id' => ['nullable', 'exists:crops,id'],
            'cultivated_area' => ['nullable', 'numeric', 'min:0'],
            'planting_date' => ['required', 'date'],
            'harvest_date' => ['nullable', 'date', 'after_or_equal:planting_date'],
            'expected_cost' => ['nullable', 'numeric', 'min:0'],
            'farmer_id' => [
                'nullable',
                'exists:parties,id',
                function ($attribute, $value, $fail) {
                    if ($value && Party::find($value)?->category !== PartyCategory::Farmer) {
                        $fail('الطرف المحدد ليس من فئة "مزارع".');
                    }
                },
            ],
            'farmer_contract_id' => [
                'nullable',
                'exists:land_contracts,id',
            ],
            'status' => [
                Rule::requiredIf($this->route('season') === null),
                Rule::in([SeasonStatus::Upcoming->value, SeasonStatus::Active->value]),
                function ($attribute, $value, $fail) {
                    if ($value !== SeasonStatus::Active->value) {
                        return;
                    }

                    $landId = $this->input('land_id');

                    $seasonParam = $this->route('season');
                    $seasonId = $seasonParam instanceof LandSeason ? $seasonParam->id : $seasonParam;

                    $query = LandSeason::where('land_id', $landId)
                        ->where('status', SeasonStatus::Active->value);

                    if ($seasonId) {
                        $query->where('id', '!=', $seasonId);
                    }

                    if ($query->exists()) {
                        $fail('يوجد موسم نشط بالفعل لهذه الأرض. يجب إنهاء الموسم الحالي أولاً.');
                    }
                },
            ],
            'notes' => ['nullable', 'string'],
        ];
    }
}
