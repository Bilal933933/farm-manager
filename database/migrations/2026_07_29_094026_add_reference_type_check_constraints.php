<?php

use App\Domains\Common\Enums\ReferenceType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private function migrateData(): void
    {
        $map = [
            'App\\Domains\\Lands\\Models\\LandSeason' => ReferenceType::LandSeason->value,
            'App\\Domains\\Purchases\\Models\\Purchase' => ReferenceType::Purchase->value,
            'App\\Domains\\Sales\\Models\\Sale' => ReferenceType::Sale->value,
            'App\\Domains\\Payments\\Models\\Payment' => ReferenceType::Payment->value,
        ];

        foreach (['stock_movements', 'payments', 'ledger_entries'] as $table) {
            foreach ($map as $old => $new) {
                DB::table($table)
                    ->where('reference_type', $old)
                    ->update(['reference_type' => $new]);
            }
        }
    }

    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        $this->migrateData();

        $types = array_map(fn (ReferenceType $case) => "'{$case->value}'", ReferenceType::cases());
        $allowed = implode(', ', $types);

        foreach (['stock_movements', 'payments', 'ledger_entries'] as $table) {
            DB::statement("ALTER TABLE {$table} ADD CONSTRAINT {$table}_reference_type_check CHECK (reference_type IN ({$allowed}))");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        foreach (['stock_movements', 'payments', 'ledger_entries'] as $table) {
            DB::statement("ALTER TABLE {$table} DROP CONSTRAINT IF EXISTS {$table}_reference_type_check");
        }
    }
};
