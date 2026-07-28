<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class Attachment extends Model
{
    protected $fillable = [
        'attachable_type',
        'attachable_id',
        'filename',
        'path',
        'mime_type',
        'size',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return Storage::url($this->path);
    }

    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }
}
