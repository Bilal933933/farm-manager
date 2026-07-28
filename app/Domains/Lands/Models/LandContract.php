<?php

namespace App\Domains\Lands\Models;

use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Models\Payment;
use Database\Factories\LandContractFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class LandContract extends Model
{
    /** @use HasFactory<LandContractFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'land_id',
        'party_id',
        'type',
        'settlement_type',
        'share_percentage',
        'start_date',
        'end_date',
        'amount',
        'notes',
    ];

    protected $appends = ['paid_amount', 'remaining'];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'amount' => 'decimal:2',
            'share_percentage' => 'decimal:2',
        ];
    }

    public function land()
    {
        return $this->belongsTo(Land::class);
    }

    public function party()
    {
        return $this->belongsTo(Party::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'contract_id');
    }

    public function getPaidAmountAttribute(): float
    {
        return (float) $this->payments()->sum('amount');
    }

    public function getRemainingAttribute(): float
    {
        return max(0, (float) $this->amount - $this->paid_amount);
    }
}
