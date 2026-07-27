<?php

namespace App\Domains\Harvests\Http\Controllers;

use App\Domains\Harvests\Actions\RecordHarvest;
use App\Domains\Harvests\Requests\StoreHarvestRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class HarvestController extends Controller
{
    public function store(StoreHarvestRequest $request, RecordHarvest $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->back();
    }
}
