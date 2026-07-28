import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Plus, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateDisplay } from '@/components/ui/date-display';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Attachment {
  id: number;
  filename: string;
  url: string;
}

interface Sale {
  id: number;
  date: string;
  quantity: string;
  unit_price: string;
  total: number;
  payment_type: string;
  description?: string;
  party: { id: number; name: string };
  harvest: {
    id: number;
    land_season: {
      land: { id: number; name: string };
      crop: { id: number; name: string } | null;
    };
  };
  attachments?: Attachment[];
}

interface IndexProps {
  sales: Sale[];
}

export default function Index({ sales }: IndexProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <div dir="rtl" className="mx-auto max-w-6xl space-y-6 p-6">
      <Head title="المبيعات" />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900">المبيعات</h1>
        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
          <Link href={route('sales.create')}>
            <Plus className="ms-2 h-4 w-4" />
            إضافة بيع
          </Link>
        </Button>
      </div>

      <Card className="border-stone-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">المحصول</TableHead>
              <TableHead className="text-right">الأرض</TableHead>
              <TableHead className="text-right">المشتري</TableHead>
              <TableHead className="text-right">الكمية</TableHead>
              <TableHead className="text-right">سعر الوحدة</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
              <TableHead className="text-right">نوع الدفع</TableHead>
              <TableHead className="text-center">اسكرين شوت</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-stone-500">
                  لا توجد مبيعات مسجّلة بعد.
                </TableCell>
              </TableRow>
            )}
            {sales.map((sale) => {
              const screenshot = sale.attachments?.[0];

              return (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono">
                    <Link href={route('sales.show', sale.id)} className="hover:text-emerald-700 hover:underline">
                      <DateDisplay date={sale.date} />
                    </Link>
                  </TableCell>
                  <TableCell>{sale.harvest?.land_season?.crop?.name || '—'}</TableCell>
                  <TableCell>{sale.harvest?.land_season?.land?.name || '—'}</TableCell>
                  <TableCell>{sale.party?.name || '—'}</TableCell>
                  <TableCell className="font-mono">{sale.quantity}</TableCell>
                  <TableCell className="font-mono">{sale.unit_price}</TableCell>
                  <TableCell className="font-mono">{sale.total.toFixed(2)}</TableCell>
                  <TableCell>{sale.payment_type}</TableCell>
                  <TableCell className="text-center">
                    {screenshot ? (
                      <button
                        type="button"
                        onClick={() => setPreviewUrl(screenshot.url)}
                        className="inline-flex items-center justify-center rounded-md bg-stone-100 p-1.5 text-stone-500 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!previewUrl} onOpenChange={(open) => { if (!open) setPreviewUrl(null); }}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">اسكرين شوت</DialogTitle>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="اسكرين شوت"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
