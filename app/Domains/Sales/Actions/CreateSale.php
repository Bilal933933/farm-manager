<?php

namespace App\Domains\Sales\Actions;

use App\Domains\Common\Enums\ReferenceType;
use App\Domains\Lands\Actions\CalculateSeasonFinancials;
use App\Domains\Lands\Models\Harvest;
use App\Domains\Ledger\Actions\RecordLedgerEntry;
use App\Domains\Ledger\Enums\LedgerDirection;
use App\Domains\Sales\Models\Sale;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CreateSale
{
    public function __construct(
        private RecordLedgerEntry $recordLedgerEntry,
        private CalculateSeasonFinancials $calculateSeasonFinancials,
    ) {}

    public function execute(array $data): Sale
    {
        return DB::transaction(function () use ($data) {
            $sale = Sale::create($data);

            $totalAmount = $data['quantity'] * $data['unit_price'];

            $this->recordLedgerEntry->execute([
                'date' => $data['date'],
                'direction' => LedgerDirection::Credit->value,
                'amount' => $totalAmount,
                'description' => 'بيع محصول',
                'party_id' => $data['party_id'],
                'reference_type' => ReferenceType::Sale->value,
                'reference_id' => $sale->id,
            ]);

            $this->handleScreenshot($data, $sale);

            $harvest = Harvest::find($data['harvest_id']);
            if ($harvest?->land_season_id) {
                $this->calculateSeasonFinancials->forSeason($harvest->landSeason);
            }

            return $sale;
        });
    }

    private function handleScreenshot(array $data, Sale $sale): void
    {
        if (! isset($data['screenshot']) || ! ($data['screenshot'] instanceof UploadedFile)) {
            return;
        }

        $file = $data['screenshot'];
        $filename = 'sale-'.$sale->id.'-'.time().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs('attachments', $filename, 'public');

        $sale->attachments()->create([
            'filename' => $filename,
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);
    }
}
