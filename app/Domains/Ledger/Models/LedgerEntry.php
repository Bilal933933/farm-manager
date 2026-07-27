<?php

namespace App\Domains\Ledger\Models;

use App\Domains\Ledger\Enums\LedgerDirection;
use App\Domains\Parties\Models\Party;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class LedgerEntry extends Model
{
    protected $fillable = [
        'date',
        'direction',
        'amount',
        'description',
        'party_id',
        'reference_type',
        'reference_id',
    ];

    protected function casts(): array
    {
        return [
            'direction' => LedgerDirection::class,
            'amount' => 'decimal:2',
            'date' => 'date',
        ];
    }

    public function party(): BelongsTo
    {
        return $this->belongsTo(Party::class);
    }

    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    public function scopeForParty($query, Party $party)
    {
        return $query->where('party_id', $party->id);
    }
}
