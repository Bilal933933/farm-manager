<?php

namespace App\Domains\Lands\Requests;

use App\Domains\Lands\Enums\SeasonStatus;
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
            'crop' => ['nullable', 'string', 'max:255'],
            'planting_date' => ['required', 'date'],
            'harvest_date' => ['nullable', 'date', 'after_or_equal:planting_date'],
            'expected_cost' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::enum(SeasonStatus::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
