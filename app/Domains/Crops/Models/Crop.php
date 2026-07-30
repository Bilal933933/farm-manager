<?php

namespace App\Domains\Crops\Models;

use App\Domains\Crops\Enums\CropCategory;
use App\Domains\Crops\Enums\CropSeason;
use App\Domains\Crops\Enums\CropUnit;
use App\Domains\Lands\Models\LandSeason;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Crop extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'category',
        'unit',
        'typical_season',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'category' => CropCategory::class,
            'unit' => CropUnit::class,
            'typical_season' => CropSeason::class,
        ];
    }

    public function landSeasons(): HasMany
    {
        return $this->hasMany(LandSeason::class);
    }
}
