<?php

namespace App\Domains\Sales\Requests;

use App\Domains\Parties\Enums\PartyCategory;
use App\Domains\Parties\Models\Party;
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
            'screenshot' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif,webp', 'max:5120'],
        ];
    }

    public function after(): array
    {
        return [
            function () {
                $party = Party::find($this->party_id);
                if (! $party || ! $party->category) {
                    return;
                }

                if ($party->category !== PartyCategory::Merchant) {
                    $this->validator->errors()->add('party_id', 'لا يمكن إجراء بيع لطرف تصنيفه "'.$party->category->value.'". المبيعات متاحة فقط لأطراف تصنيف "تاجر".');
                }
            },
        ];
    }
}
