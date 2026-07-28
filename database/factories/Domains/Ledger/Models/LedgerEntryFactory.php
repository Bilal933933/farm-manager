<?php

namespace Database\Factories\Domains\Ledger\Models;

use App\Domains\Ledger\Enums\LedgerDirection;
use App\Domains\Ledger\Models\LedgerEntry;
use App\Domains\Parties\Models\Party;
use Illuminate\Database\Eloquent\Factories\Factory;

class LedgerEntryFactory extends Factory
{
    protected $model = LedgerEntry::class;

    public function definition(): array
    {
        return [
            'date' => fake()->date(),
            'direction' => fake()->randomElement(LedgerDirection::cases())->value,
            'amount' => fake()->randomFloat(2, 100, 50000),
            'description' => fake()->sentence(),
            'party_id' => Party::factory(),
        ];
    }
}
