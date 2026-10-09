import { router } from '@inertiajs/react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { LandOption, SeasonOption, SeasonFilterValues } from '@/types/filters';

interface Props {
    lands: LandOption[];
    seasons: SeasonOption[];
    filters: SeasonFilterValues;
    routeName: string;
    className?: string;
}

export default function SeasonFilter({ lands, seasons, filters, routeName, className }: Props) {
    const selectedLandId = filters.land_id ?? '';
    const selectedSeasonId = filters.land_season_id ?? '';

    const filteredSeasons = selectedLandId
        ? seasons.filter((s) => String(s.land_id) === String(selectedLandId))
        : seasons;

    function updateFilter(key: keyof SeasonFilterValues, value: string) {
        const newFilters: Record<string, string> = { ...filters };

        if (value === '' || value === 'all') {
            delete newFilters[key];

            if (key === 'land_id') {
                delete newFilters['land_season_id'];
            }
        } else {
            newFilters[key] = value;

            if (key === 'land_id' && newFilters['land_season_id']) {
                const seasonBelongsToLand = seasons.some(
                    (s) => String(s.id) === String(newFilters['land_season_id']) && String(s.land_id) === String(value),
                );

                if (!seasonBelongsToLand) {
                    delete newFilters['land_season_id'];
                }
            }
        }

        router.get(route(routeName), newFilters, { preserveState: true, replace: true });
    }

    function clearFilters() {
        router.get(route(routeName), {}, { preserveState: true, replace: true });
    }

    const hasActiveFilter = Boolean(filters.land_id || filters.land_season_id);

    return (
        <div className={`flex flex-wrap items-end gap-4 rounded-xl border border-stone-200/80 bg-stone-50/70 p-4 shadow-xs backdrop-blur-sm transition-all ${className ?? ''}`}>
            <div className="flex items-center gap-2 self-center pb-2 text-stone-500">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-medium">تصفية العرض:</span>
            </div>

            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-stone-600">الأرض الزراعية</Label>
                <Select value={selectedLandId || 'all'} onValueChange={(v) => updateFilter('land_id', v === 'all' ? '' : v)}>
                    <SelectTrigger className="w-48 bg-white border-stone-200 shadow-2xs">
                        <SelectValue placeholder="كل الأراضي" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">كل الأراضي</SelectItem>
                        {lands.map((land) => (
                            <SelectItem key={land.id} value={String(land.id)}>
                                {land.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-stone-600">الموسم الزراعي</Label>
                <Select
                    value={selectedSeasonId || 'all'}
                    onValueChange={(v) => updateFilter('land_season_id', v === 'all' ? '' : v)}
                >
                    <SelectTrigger className="w-64 bg-white border-stone-200 shadow-2xs">
                        <SelectValue placeholder="كل المواسم" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">كل المواسم</SelectItem>
                        {filteredSeasons.map((season) => (
                            <SelectItem key={season.id} value={String(season.id)}>
                                {season.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {hasActiveFilter && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="mb-0.5 border-stone-200 hover:bg-stone-100 text-stone-600">
                    <X className="h-4 w-4" />
                    مسح الفلترة
                </Button>
            )}
        </div>
    );
}
