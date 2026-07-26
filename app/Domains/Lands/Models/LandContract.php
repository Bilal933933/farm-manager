<?php

namespace App\Domains\Lands\Models;

use App\Domains\Parties\Models\Party;
use Database\Factories\LandContractFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LandContract extends Model
{
    /** @use HasFactory<LandContractFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'land_id',
        'party_id',
        'type',
        'start_date',
        'end_date',
        'amount',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'amount' => 'decimal:2',
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
}
