<?php

namespace App\Domains\Lands\Requests;

use App\Domains\Lands\Enums\CostType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListCostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'land_id' => ['nullable', 'exists:lands,id'],
            'land_season_id' => ['nullable', 'exists:land_seasons,id'],
            'crop_id' => ['nullable', 'exists:crops,id'],
            'type' => ['nullable', Rule::enum(CostType::class)],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'search' => ['nullable', 'string', 'max:255'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
