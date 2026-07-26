<?php

namespace App\Domains\Lands\Requests;

use App\Domains\Lands\Enums\AreaUnit;
use App\Domains\Lands\Enums\LandStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string'],
            'area' => ['required', 'numeric', 'min:0'],
            'area_unit' => ['required', Rule::enum(AreaUnit::class)],
            'status' => ['required', Rule::enum(LandStatus::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
