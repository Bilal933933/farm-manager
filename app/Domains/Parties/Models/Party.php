<?php

namespace App\Domains\Parties\Models;

use App\Domains\Lands\Models\LandContract;
use App\Domains\Parties\Enums\PartyCategory;
use App\Domains\Payments\Models\Payment;
use App\Domains\Purchases\Models\Purchase;
use App\Domains\Sales\Models\Sale;
use Database\Factories\PartyFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Party extends Model
{
    /** @use HasFactory<PartyFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'category',
        'phone',
        'email',
        'national_id',
        'address',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'category' => PartyCategory::class,
        ];
    }

    public function contracts()
    {
        return $this->hasMany(LandContract::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
