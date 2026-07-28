<?php

namespace Database\Factories\Domains\Payments\Models;

use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Enums\PaymentType;
use App\Domains\Payments\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'party_id' => Party::factory(),
            'type' => fake()->randomElement(PaymentType::cases())->value,
            'date' => fake()->date(),
            'amount' => fake()->randomFloat(2, 100, 100000),
        ];
    }

    public function payment(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PaymentType::Payment->value,
        ]);
    }

    public function receipt(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PaymentType::Receipt->value,
        ]);
    }

    public function advance(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PaymentType::Advance->value,
        ]);
    }
}
