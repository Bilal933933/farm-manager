<?php

namespace App\Domains\Lands\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHarvestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'land_season_id' => ['required', 'exists:land_seasons,id'],
            'date' => ['required', 'date'],
            'name' => ['required', 'string', 'max:500'],
            'quantity' => ['required', 'numeric', 'min:0.01'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
