<?php

namespace App\Domains\Naqoot\Models;

use App\Domains\Naqoot\Enums\NaqootDirection;
use Database\Factories\Domains\Naqoot\Models\NaqootFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Naqoot extends Model
{
    /** @use HasFactory<NaqootFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'naqoot';

    protected $fillable = [
        'name',
        'date',
        'amount',
        'direction',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'amount' => 'decimal:2',
            'direction' => NaqootDirection::class,
        ];
    }
}
