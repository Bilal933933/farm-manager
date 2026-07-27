import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Pencil, Plus, Sprout, DollarSign, TrendingUp, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateDisplay } from '@/components/ui/date-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusBadge from '@/components/Lands/StatusBadge';
import SeasonFormDialog from '@/components/Lands/SeasonFormDialog';
import ContractFormDialog from '@/components/Lands/ContractFormDialog';
import HarvestFormDialog from '@/components/Harvests/HarvestFormDialog';
import { useState } from 'react';

interface Crop {
  id: number;
  name: string;
}

interface HarvestItem {
  id: number;
  date: string;
  quantity: string;
}

interface Season {
  id: number;
  crop_id?: number | null;
  crop_obj?: Crop | null;
  cultivated_area?: string;
  crop: string;
  planting_date: string;
  harvest_date?: string;
  expected_cost?: string;
  actual_cost?: string;
  status: string;
  harvests?: HarvestItem[];
}

interface Contract {
  id: number;
  type: string;
  start_date: string;
  end_date?: string;
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

interface SeasonStats {
  total_harvest: number;
  total_sales: number;
  total_sold_qty: number;
  total_cost: number;
  profit: number;
}

interface ShowProps {
  land: Land;
  crops: Crop[];
  activeSeason: Season | null;
  seasonStats: Record<number, SeasonStats>;
  overallSales: number;
  overallCosts: number;
}

export default function Show({ land, crops, activeSeason, seasonStats, overallSales, overallCosts }: ShowProps) {
  function deleteSeason(season: Season) {
    router.delete(route('lands.seasons.destroy', season.id));
  }

  function deleteContract(contract: Contract) {
    router.delete(route('lands.contracts.destroy', contract.id));
  }

  const overallProfit = overallSales - overallCosts;

  return (
    <div dir="rtl" className="mx-auto max-w-6xl space-y-6 p-6">
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

      {activeSeason && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-emerald-700" />
              <CardTitle className="text-emerald-900">الموسم الحالي</CardTitle>
              <StatusBadge value={activeSeason.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-stone-500">المحصول</p>
                <p className="font-semibold text-stone-900">
                  {activeSeason.crop_obj?.name || activeSeason.crop || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500">المساحة المزروعة</p>
                <p className="font-mono font-semibold text-stone-900">
                  {activeSeason.cultivated_area || '—'} {land.area_unit === 'دونم' ? 'دونم' : ''}
                </p>
              </div>
              {activeSeason.planting_date && (
                <div>
                  <p className="text-xs text-stone-500">تاريخ الزراعة</p>
                  <p className="font-mono font-semibold text-stone-900">
                    <DateDisplay date={activeSeason.planting_date} />
                  </p>
                </div>
              )}
              {activeSeason.expected_cost && (
                <div>
                  <p className="text-xs text-stone-500">التكلفة المتوقعة</p>
                  <p className="font-mono font-semibold text-stone-900">{activeSeason.expected_cost}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="border-stone-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500">إجمالي الحصاد</p>
                <p className="mt-1 text-xl font-bold text-stone-900">
                  {seasonStats && Object.values(seasonStats).reduce((s, st) => s + st.total_harvest, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500">إجمالي المبيعات</p>
                <p className="mt-1 text-xl font-bold text-stone-900">{overallSales.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500">إجمالي التكاليف</p>
                <p className="mt-1 text-xl font-bold text-stone-900">{overallCosts.toLocaleString()}</p>
              </div>
              <CircleDollarSign className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500">صافي الربح</p>
                <p className={`mt-1 text-xl font-bold ${overallProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {overallProfit.toLocaleString()}
                </p>
              </div>
              <Sprout className={`h-8 w-8 ${overallProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="seasons">
        <TabsList>
          <TabsTrigger value="seasons">المواسم الزراعية ({land.seasons?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="contracts">العقود ({land.contracts?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="seasons" className="space-y-4">
          <div className="flex justify-start">
            <SeasonFormDialog
              landId={land.id}
              crops={crops}
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
                  <TableHead className="text-right">المساحة</TableHead>
                  <TableHead className="text-right">الزراعة</TableHead>
                  <TableHead className="text-right">الحصاد</TableHead>
                  <TableHead className="text-right">المبيعات</TableHead>
                  <TableHead className="text-right">التكلفة</TableHead>
                  <TableHead className="text-right">الربح</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(land.seasons ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-stone-500">
                      لا توجد مواسم مسجّلة لهذه الأرض بعد.
                    </TableCell>
                  </TableRow>
                )}
                {(land.seasons ?? []).map((season) => {
                  const cropName = season.crop_obj?.name || season.crop;
                  const stats = seasonStats[season.id];
                  const totalHarvest = stats?.total_harvest ?? 0;
                  const totalSales = stats?.total_sales ?? 0;
                  const totalCost = stats?.total_cost ?? 0;
                  const profit = stats?.profit ?? 0;

                  return (
                    <TableRow key={season.id}>
                      <TableCell className="font-medium">{cropName}</TableCell>
                      <TableCell className="font-mono">{season.cultivated_area || '—'}</TableCell>
                      <TableCell className="font-mono"><DateDisplay date={season.planting_date} /></TableCell>
                      <TableCell className="font-mono">{totalHarvest > 0 ? totalHarvest : '—'}</TableCell>
                      <TableCell className="font-mono">{totalSales > 0 ? totalSales.toLocaleString() : '—'}</TableCell>
                      <TableCell className="font-mono">{totalCost > 0 ? totalCost.toLocaleString() : '—'}</TableCell>
                      <TableCell className={`font-mono ${profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {profit !== 0 ? profit.toLocaleString() : '—'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge value={season.status} />
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex justify-start gap-2">
                          {totalHarvest > 0 && (
                            <span className="font-mono text-xs text-stone-500 self-center">{totalHarvest}</span>
                          )}
                          <HarvestFormDialog
                            landSeasonId={season.id}
                            trigger={<Button variant="ghost" size="sm">حصاد</Button>}
                          />
                          <SeasonFormDialog
                            landId={land.id}
                            season={season}
                            crops={crops}
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
                  );
                })}
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
                    <TableCell className="font-mono"><DateDisplay date={contract.start_date} /></TableCell>
                    <TableCell className="font-mono">{contract.end_date ? <DateDisplay date={contract.end_date} /> : '—'}</TableCell>
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