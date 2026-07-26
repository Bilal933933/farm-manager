import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Pencil, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusBadge from '@/Components/Lands/StatusBadge';
import SeasonFormDialog from '@/Components/Lands/SeasonFormDialog';
import ContractFormDialog from '@/Components/Lands/ContractFormDialog';

interface Season {
  id: number;
  crop: string;
  planting_date: string;
  harvest_date: string | null;
  expected_cost: string | null;
  actual_cost: string | null;
  status: string;
}

interface Contract {
  id: number;
  type: string;
  start_date: string;
  end_date: string | null;
  amount: string;
}

interface Land {
  id: number;
  name: string;
  location: string | null;
  area: string;
  area_unit: string;
  status: string;
  notes: string | null;
  seasons?: Season[];
  contracts?: Contract[];
}

interface ShowProps {
  land: Land;
}

export default function Show({ land }: ShowProps) {
  function deleteSeason(season: Season) {
    router.delete(route('lands.seasons.destroy', season.id));
  }

  function deleteContract(contract: Contract) {
    router.delete(route('lands.contracts.destroy', contract.id));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-4xl space-y-6 p-6">
      <Head title={land.name} />

      <Link
        href={route('lands.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى الأراضي
      </Link>

      <Card className="border-stone-200">
        <CardContent className="flex flex-wrap items-start justify-between gap-4 p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-stone-900">{land.name}</h1>
              <StatusBadge value={land.status} />
            </div>
            <p className="text-sm text-stone-500">{land.location || 'لا يوجد موقع مسجّل'}</p>
            <p className="font-mono text-sm text-stone-700">
              المساحة: {land.area} {land.area_unit}
            </p>
            {land.notes && <p className="max-w-xl text-sm text-stone-500">{land.notes}</p>}
          </div>
          <Button variant="outline" asChild>
            <Link href={route('lands.edit', land.id)}>
              <Pencil className="ms-2 h-4 w-4" />
              تعديل البيانات
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="seasons">
        <TabsList>
          <TabsTrigger value="seasons">المواسم الزراعية ({land.seasons?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="contracts">العقود ({land.contracts?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="seasons" className="space-y-4">
          <div className="flex justify-start">
            <SeasonFormDialog
              landId={land.id}
              trigger={
                <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                  <Plus className="ms-2 h-4 w-4" />
                  إضافة موسم
                </Button>
              }
            />
          </div>

          <Card className="border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المحصول</TableHead>
                  <TableHead className="text-right">الزراعة</TableHead>
                  <TableHead className="text-right">الحصاد</TableHead>
                  <TableHead className="text-right">التكلفة المتوقعة</TableHead>
                  <TableHead className="text-right">التكلفة الفعلية</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(land.seasons ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-stone-500">
                      لا توجد مواسم مسجّلة لهذه الأرض بعد.
                    </TableCell>
                  </TableRow>
                )}
                {(land.seasons ?? []).map((season) => (
                  <TableRow key={season.id}>
                    <TableCell className="font-medium">{season.crop}</TableCell>
                    <TableCell className="font-mono">{season.planting_date}</TableCell>
                    <TableCell className="font-mono">{season.harvest_date || '—'}</TableCell>
                    <TableCell className="font-mono">{season.expected_cost ?? '—'}</TableCell>
                    <TableCell className="font-mono">{season.actual_cost ?? '—'}</TableCell>
                    <TableCell>
                      <StatusBadge value={season.status} />
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex justify-start gap-2">
                        <SeasonFormDialog
                          landId={land.id}
                          season={season}
                          trigger={<Button variant="ghost" size="sm">تعديل</Button>}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-600 hover:text-rose-700"
                          onClick={() => deleteSeason(season)}
                        >
                          حذف
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="flex justify-start">
            <ContractFormDialog
              landId={land.id}
              trigger={
                <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                  <Plus className="ms-2 h-4 w-4" />
                  إضافة عقد
                </Button>
              }
            />
          </div>

          <Card className="border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">البداية</TableHead>
                  <TableHead className="text-right">الانتهاء</TableHead>
                  <TableHead className="text-right">القيمة</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(land.contracts ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-stone-500">
                      لا توجد عقود مسجّلة لهذه الأرض بعد.
                    </TableCell>
                  </TableRow>
                )}
                {(land.contracts ?? []).map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <StatusBadge value={contract.type} />
                    </TableCell>
                    <TableCell className="font-mono">{contract.start_date}</TableCell>
                    <TableCell className="font-mono">{contract.end_date || '—'}</TableCell>
                    <TableCell className="font-mono">{contract.amount}</TableCell>
                    <TableCell className="text-left">
                      <div className="flex justify-start gap-2">
                        <ContractFormDialog
                          landId={land.id}
                          contract={contract}
                          trigger={<Button variant="ghost" size="sm">تعديل</Button>}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-600 hover:text-rose-700"
                          onClick={() => deleteContract(contract)}
                        >
                          حذف
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
