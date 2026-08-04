<?php

namespace App\Domains\Payments\Requests;

use App\Domains\Parties\Enums\PartyCategory;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Enums\PaymentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'party_id' => ['required', 'exists:parties,id'],
            'contract_id' => ['nullable', 'exists:land_contracts,id'],
            'land_season_id' => ['nullable', 'exists:land_seasons,id'],
            'type' => ['required', Rule::enum(PaymentType::class)],
            'date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'notes' => ['nullable', 'string'],
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

                $allowed = match ($party->category) {
                    PartyCategory::Lessor, PartyCategory::Supplier, PartyCategory::Farmer => [PaymentType::Payment, PaymentType::Advance],
                    PartyCategory::Lessee, PartyCategory::Merchant => [PaymentType::Receipt],
                    PartyCategory::Amanat => [PaymentType::Payment, PaymentType::Receipt],
                    default => [PaymentType::Payment, PaymentType::Receipt, PaymentType::Advance],
                };

                $type = PaymentType::tryFrom($this->type);
                if ($type && ! in_array($type, $allowed)) {
                    $this->validator->errors()->add('type', 'لا يمكن تسجيل "'.$this->type.'" لطرف من تصنيف "'.$party->category->value.'".');
                }
            },
        ];
    }
}
