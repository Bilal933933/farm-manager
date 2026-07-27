<?php

namespace App\Domains\Crops\Requests;

use App\Domains\Crops\Enums\CropCategory;
use App\Domains\Crops\Enums\CropSeason;
use App\Domains\Crops\Enums\CropUnit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCropRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::enum(CropCategory::class)],
            'unit' => ['required', Rule::enum(CropUnit::class)],
            'typical_season' => ['nullable', Rule::enum(CropSeason::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
