<?php

namespace App\Domains\Sales\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListSaleRequest extends FormRequest
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
        ];
    }
}
