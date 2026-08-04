import { Sprout } from 'lucide-react';
import StatusBadge from '@/components/Lands/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import type { Crop, Season } from '@/types';

function getCropName(season: Season): string {
  if (season.crop_obj?.name) {
return season.crop_obj.name;
}

  if (season.crop && typeof season.crop === 'object' && 'name' in season.crop) {
return (season.crop as Crop).name;
}

  return '—';
}

interface ActiveSeasonCardProps {
  activeSeason: Season | null;
  areaUnit?: string;
}

export default function ActiveSeasonCard({ activeSeason, areaUnit }: ActiveSeasonCardProps) {
  if (!activeSeason) {
return null;
}

  return (
    <Card className="border-emerald-200 bg-emerald-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sprout className="h-5 w-5 text-emerald-700" />
          <CardTitle className="text-emerald-900">الموسم الحالي</CardTitle>
          <StatusBadge value={activeSeason.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-stone-500">المحصول</p>
            <p className="mt-0.5 font-semibold text-stone-900">{getCropName(activeSeason)}</p>
          </div>
          <div>
            <p className="text-xs text-stone-500">المساحة المزروعة</p>
            <p className="mt-0.5 font-mono font-semibold text-stone-900">
              {activeSeason.cultivated_area || '—'} {areaUnit === 'فدان' ? 'فدان' : ''}
            </p>
          </div>
          {activeSeason.planting_date && (
            <div>
              <p className="text-xs text-stone-500">تاريخ الزراعة</p>
              <p className="mt-0.5 font-mono font-semibold text-stone-900">
                <DateDisplay date={activeSeason.planting_date} />
              </p>
            </div>
          )}
          {activeSeason.expected_cost && (
            <div>
              <p className="text-xs text-stone-500">التكلفة المتوقعة</p>
              <p className="mt-0.5 font-mono font-semibold text-stone-900">{activeSeason.expected_cost}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}