<?php

namespace App\Domains\Sales\Requests;

use App\Domains\Sales\Enums\SaleType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'harvest_id' => ['required', 'exists:harvests,id'],
            'party_id' => ['required', 'exists:parties,id'],
            'quantity' => ['required', 'numeric', 'min:0.01'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'date' => ['required', 'date'],
            'payment_type' => ['required', Rule::enum(SaleType::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
