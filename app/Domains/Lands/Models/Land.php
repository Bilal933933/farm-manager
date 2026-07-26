<?php

namespace App\Domains\Lands\Models;

use Database\Factories\LandFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Land extends Model
{
    /** @use HasFactory<LandFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'location', 'area', 'area_unit', 'status', 'notes'];

    protected function casts(): array
    {
        return [
            'area' => 'decimal:2',
        ];
    }

    public function contracts()
    {
        return $this->hasMany(LandContract::class);
    }

    public function seasons()
    {
        return $this->hasMany(LandSeason::class);
    }
}
