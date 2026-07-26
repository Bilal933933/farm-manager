<?php

namespace App\Domains\Parties\Models;

use App\Domains\Lands\Models\LandContract;
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
        'phone',
        'email',
        'national_id',
        'address',
        'notes',
    ];

    public function contracts()
    {
        return $this->hasMany(LandContract::class);
    }
}
