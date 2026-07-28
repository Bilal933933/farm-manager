<?php

namespace Database\Factories\Domains\Purchases\Models;

use App\Domains\Parties\Models\Party;
use App\Domains\Purchases\Enums\PaymentType;
use App\Domains\Purchases\Models\Purchase;
use Illuminate\Database\Eloquent\Factories\Factory;

class PurchaseFactory extends Factory
{
    protected $model = Purchase::class;

    public function definition(): array
    {
        return [
            'party_id' => Party::factory()->supplier(),
            'date' => fake()->date(),
            'payment_type' => fake()->randomElement(PaymentType::cases())->value,
        ];
    }
}
