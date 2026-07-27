<?php

namespace App\Domains\Lands\Models;

use App\Domains\Crops\Models\Crop;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cost extends Model
{
    use SoftDeletes;

    protected $fillable = ['land_id', 'land_season_id', 'crop_id', 'type', 'description', 'amount', 'date', 'notes'];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'date' => 'date',
        ];
    }

    public function land(): BelongsTo
    {
        return $this->belongsTo(Land::class);
    }

    public function landSeason(): BelongsTo
    {
        return $this->belongsTo(LandSeason::class);
    }

    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class);
    }
}
