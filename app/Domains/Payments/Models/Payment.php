<?php

namespace App\Domains\Payments\Models;

use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Enums\PaymentType as PaymentTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'party_id',
        'contract_id',
        'land_season_id',
        'type',
        'date',
        'amount',
        'reference_type',
        'reference_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'type' => PaymentTypeEnum::class,
            'date' => 'date',
            'amount' => 'decimal:2',
        ];
    }

    public function party(): BelongsTo
    {
        return $this->belongsTo(Party::class);
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(LandContract::class);
    }

    public function landSeason(): BelongsTo
    {
        return $this->belongsTo(LandSeason::class);
    }

    public function reference(): MorphTo
    {
        return $this->morphTo();
    }
}
