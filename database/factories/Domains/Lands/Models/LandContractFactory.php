<?php

namespace Database\Factories\Domains\Lands\Models;

use App\Domains\Lands\Enums\ContractType;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandContract;
use App\Domains\Parties\Models\Party;
use Illuminate\Database\Eloquent\Factories\Factory;

class LandContractFactory extends Factory
{
    protected $model = LandContract::class;

    public function definition(): array
    {
        return [
            'land_id' => Land::factory(),
            'party_id' => Party::factory()->lessor(),
            'type' => fake()->randomElement(ContractType::cases())->value,
            'start_date' => '2024-01-01',
            'end_date' => '2026-12-31',
            'amount' => fake()->randomFloat(2, 50000, 500000),
        ];
    }

    public function lease(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => ContractType::Lease->value,
        ]);
    }

    public function ownership(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => ContractType::Ownership->value,
        ]);
    }
}
