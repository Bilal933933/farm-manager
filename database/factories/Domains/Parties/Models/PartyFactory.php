<?php

namespace Database\Factories\Domains\Parties\Models;

use App\Domains\Parties\Enums\PartyCategory;
use App\Domains\Parties\Enums\PartyType;
use App\Domains\Parties\Models\Party;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Party>
 */
class PartyFactory extends Factory
{
    protected $model = Party::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'type' => fake()->randomElement([PartyType::Individual->value, PartyType::Company->value]),
            'category' => fake()->randomElement(PartyCategory::cases())->value,
            'phone' => fake()->phoneNumber(),
            'email' => fake()->safeEmail(),
            'address' => fake()->address(),
            'notes' => fake()->sentence(),
        ];
    }

    public function withoutCategory(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => null,
        ]);
    }

    public function lessor(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => PartyCategory::Lessor->value,
        ]);
    }

    public function lessee(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => PartyCategory::Lessee->value,
        ]);
    }

    public function farmer(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => PartyCategory::Farmer->value,
        ]);
    }

    public function supplier(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => PartyCategory::Supplier->value,
        ]);
    }

    public function merchant(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => PartyCategory::Merchant->value,
        ]);
    }
}
