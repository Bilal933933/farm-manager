<?php

namespace App\Domains\Lands\Requests;

use App\Domains\Lands\Enums\ContractType;
use App\Domains\Parties\Models\Party;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLandContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $type = $this->input('type');

        return [
            'land_id' => ['required', 'exists:lands,id'],
            'party_id' => [
                'nullable',
                'exists:parties,id',
                function ($attribute, $value, $fail) use ($type) {
                    if (! $value) {
                        return;
                    }

                    $party = Party::find($value);

                    $expectedCategory = match ($type) {
                        'مؤجر' => 'مؤجر',
                        'مستأجر' => 'مستأجر',
                        'مزارع' => 'مزارع',
                        default => null,
                    };

                    if ($expectedCategory && $party?->category !== $expectedCategory) {
                        $fail("فئة الطرف يجب أن تكون \"{$expectedCategory}\" لهذا النوع من العقود.");
                    }
                },
            ],
            'type' => ['required', Rule::enum(ContractType::class)],
            'settlement_type' => $type === 'مزارع'
                ? ['required', 'string', 'in:ثابت,نسبة']
                : ['nullable', 'string', 'in:ثابت,نسبة'],
            'share_percentage' => $type === 'مزارع'
                ? ['required_if:settlement_type,نسبة', 'nullable', 'numeric', 'min:0', 'max:100']
                : ['nullable', 'numeric', 'min:0', 'max:100'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'amount' => $type === 'مزارع' && $this->input('settlement_type') === 'نسبة'
                ? ['nullable', 'numeric', 'min:0']
                : ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
