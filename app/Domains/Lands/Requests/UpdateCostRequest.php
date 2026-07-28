<?php

namespace App\Domains\Lands\Requests;

use App\Domains\Lands\Enums\CostType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'land_id' => ['required', 'exists:lands,id'],
            'land_season_id' => ['required', 'exists:land_seasons,id'],
            'borne_by' => ['nullable', 'string', 'in:مشترك,مزارع,مالك'],
            'type' => ['required', Rule::enum(CostType::class)],
            'description' => ['required', 'string', 'max:1000'],
            'amount' => ['required', 'numeric', 'min:0'],
            'date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
