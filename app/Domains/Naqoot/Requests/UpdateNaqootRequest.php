<?php

namespace App\Domains\Naqoot\Requests;

use App\Domains\Naqoot\Enums\NaqootDirection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateNaqootRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'direction' => ['required', Rule::enum(NaqootDirection::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
