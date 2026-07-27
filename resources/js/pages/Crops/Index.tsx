import { Head, Link, router } from '@inertiajs/react';
import { Carrot, Eye, Leaf, Pencil, Plus, Sprout, Trash2, Wheat } from 'lucide-react';
import StatusBadge from '@/components/Lands/StatusBadge';
import { ActionsMenu } from '@/components/ui/actions-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Crop {
  id: number;
  name: string;
  category: string;
  unit: string;
  typical_season: string | null;
}

interface IndexProps {
  crops: Crop[];
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'خضروات':
      return Carrot;
    case 'محاصيل حقلية':
      return Wheat;
    case 'فاكهة':
      return Sprout;
    default:
      return Leaf;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'خضروات':
      return 'bg-orange-50 border-orange-200 hover:border-orange-300';
    case 'محاصيل حقلية':
      return 'bg-amber-50 border-amber-200 hover:border-amber-300';
    case 'فاكهة':
      return 'bg-rose-50 border-rose-200 hover:border-rose-300';
    case 'أعلاف':
      return 'bg-green-50 border-green-200 hover:border-green-300';
    default:
      return 'bg-stone-50 border-stone-200 hover:border-stone-300';
  }
}

function getIconColor(category: string) {
  switch (category) {
    case 'خضروات':
      return 'text-orange-600';
    case 'محاصيل حقلية':
      return 'text-amber-600';
    case 'فاكهة':
      return 'text-rose-600';
    case 'أعلاف':
      return 'text-green-600';
    default:
      return 'text-stone-600';
  }
}

export default function Index({ crops }: IndexProps) {
  return (
    <div dir="rtl" className="space-y-6 p-6">
      <Head title="المحاصيل" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">المحاصيل</h1>
          <p className="mt-1 text-sm text-stone-500">تعريف المحاصيل الزراعية المزروعة في المزرعة</p>
        </div>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href={route('crops.create')}>
            <Plus className="ms-2 h-4 w-4" />
            إضافة محصول
          </Link>
        </Button>
      </div>

      {crops.length === 0 ? (
        <Card className="border-stone-200 py-16">
          <div className="text-center text-stone-500">
            <Sprout className="mx-auto mb-3 h-10 w-10 text-stone-300" />
            لا توجد محاصيل مسجّلة بعد. ابدأ بإضافة أول محصول.
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {crops.map((crop) => {
            const CategoryIcon = getCategoryIcon(crop.category);
            const cardColor = getCategoryColor(crop.category);
            const iconColor = getIconColor(crop.category);
            const isVegetable = crop.category === 'خضروات';

            return (
              <Card
                key={crop.id}
                className={`${cardColor} border-2 transition-all hover:shadow-md ${isVegetable ? 'ring-2 ring-orange-200 hover:ring-orange-300' : ''}`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-xl ${isVegetable ? 'bg-orange-100' : 'bg-white/50'}`}>
                      <CategoryIcon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                    <ActionsMenu
                      actions={[
                        { label: 'عرض', icon: Eye, href: route('crops.show', crop.id) },
                        { label: 'تعديل', icon: Pencil, href: route('crops.edit', crop.id) },
                        {
                          label: 'حذف', icon: Trash2, variant: 'danger',
                          delete: {
                            itemName: crop.name,
                            onDelete: () => router.delete(route('crops.destroy', crop.id)),
                            description: 'لن يمكن الحذف إذا كان المحصول مرتبطًا بموسم زراعي.',
                          },
                        },
                      ]}
                    />
                  </div>

                  <Link href={route('crops.show', crop.id)} className="block">
                    <h3 className="text-lg font-semibold text-stone-900 hover:text-emerald-700 transition-colors mb-2">
                      {crop.name}
                    </h3>
                  </Link>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-500">التصنيف</span>
                      <StatusBadge value={crop.category} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-500">الوحدة</span>
                      <span className="text-sm font-mono font-medium text-stone-700">{crop.unit}</span>
                    </div>
                    {crop.typical_season && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-500">الموسم</span>
                        <span className="text-sm font-medium text-stone-700">{crop.typical_season}</span>
                      </div>
                    )}
                  </div>

                  {isVegetable && (
                    <div className="mt-3 pt-3 border-t border-orange-200/50">
                      <span className="inline-flex items-center text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                        <Carrot className="h-3 w-3 ms-1" />
                        خضروات
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
