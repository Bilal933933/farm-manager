<?php

namespace App\Domains\Lands\Requests;

use App\Domains\Lands\Enums\ContractType;
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
        return [
            'land_id' => ['required', 'exists:lands,id'],
            'party_id' => ['nullable', 'exists:parties,id'],
            'type' => ['required', Rule::enum(ContractType::class)],
            'settlement_type' => ['nullable', 'string', 'in:ثابت,نسبة'],
            'share_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'amount' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
