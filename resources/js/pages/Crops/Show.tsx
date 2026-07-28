import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Pencil, Sprout, Ruler, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from '@/components/Lands/StatusBadge';

const CATEGORY_GRADIENT: Record<string, string> = {
  'محاصيل حقلية': 'from-amber-100 to-amber-200',
  خضروات: 'from-emerald-100 to-emerald-200',
  فاكهة: 'from-orange-100 to-orange-200',
  أعلاف: 'from-lime-100 to-lime-200',
  أخرى: 'from-stone-100 to-stone-200',
};

interface Crop {
  id: number;
  name: string;
  category: string;
  unit: string;
  typical_season: string | null;
  notes: string | null;
}

interface ShowProps {
  crop: Crop;
}

export default function Show({ crop }: ShowProps) {
  const gradient = CATEGORY_GRADIENT[crop.category] ?? 'from-stone-100 to-stone-200';

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title={crop.name} />

      <Link
        href={route('crops.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المحاصيل
      </Link>

      <Card className="overflow-hidden border-stone-200 shadow-sm">
        <div className="h-2 bg-gradient-to-l from-emerald-500 via-emerald-400 to-lime-300" />

        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <Avatar className="hidden sm:flex h-14 w-14 rounded-xl border-2 border-stone-200 shadow-sm">
                <AvatarFallback className={`rounded-xl bg-gradient-to-br ${gradient} text-stone-700`}>
                  <Sprout className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-3 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-stone-900 truncate">{crop.name}</h1>
                  <StatusBadge value={crop.category} />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
                    <Ruler className="h-3.5 w-3.5 text-stone-400" />
                    {crop.unit}
                  </span>
                  {crop.typical_season && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
                      <Calendar className="h-3.5 w-3.5 text-stone-400" />
                      {crop.typical_season}
                    </span>
                  )}
                </div>

                {crop.notes && (
                  <p className="max-w-xl text-sm text-stone-500 bg-amber-50/70 border border-amber-200/50 p-3 rounded-lg">
                    {crop.notes}
                  </p>
                )}
              </div>
            </div>

            <Button variant="outline" size="sm" asChild className="shrink-0 shadow-sm">
              <Link href={route('crops.edit', crop.id)}>
                <Pencil className="ms-2 h-4 w-4" />
                تعديل
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
