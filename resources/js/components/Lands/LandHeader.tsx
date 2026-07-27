import { Link } from '@inertiajs/react';
import { ArrowRight, Pencil } from 'lucide-react';
import StatusBadge from '@/components/Lands/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Land } from '@/types';

interface LandHeaderProps {
  land: Land;
}

export default function LandHeader({ land }: LandHeaderProps) {
  return (
    <>
      <Link
        href={route('lands.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى الأراضي
      </Link>

      <Card className="border-stone-200">
        <CardContent className="flex items-start justify-between gap-4 p-6">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-3">
              <h1 className="truncate text-2xl font-semibold text-stone-900">{land.name}</h1>
              <StatusBadge value={land.status} />
            </div>
            <p className="truncate text-sm text-stone-500">{land.location || 'لا يوجد موقع مسجّل'}</p>
            <p className="font-mono text-sm text-stone-700">
              المساحة: {land.area} {land.area_unit}
            </p>
            {land.notes && <p className="line-clamp-2 max-w-xl text-sm text-stone-500">{land.notes}</p>}
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0 self-start">
            <Link href={route('lands.edit', land.id)}>
              <Pencil className="ms-1.5 h-3.5 w-3.5" />
              تعديل
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}