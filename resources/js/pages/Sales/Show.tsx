import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Truck, Calendar, Sprout, MapPin, Package, DollarSign, CreditCard, User, ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DateDisplay } from '@/components/ui/date-display';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
  notes: string | null;
  party: { id: number; name: string };
  harvest: {
    id: number;
    date: string;
    quantity: string;
    land_season: {
      id: number;
      crop: { id: number; name: string } | null;
      land: { id: number; name: string };
    };
  };
  attachments?: Attachment[];
}

interface ShowProps {
  sale: Sale;
}

function currency(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Show({ sale }: ShowProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const screenshot = sale.attachments?.[0];

  return (
    <div dir="rtl" className="mx-auto max-w-3xl space-y-6 p-6">
      <Head title={`بيع #${sale.id}`} />

      <Link
        href={route('sales.index')}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المبيعات
      </Link>

      <Card className="overflow-hidden border-stone-200 shadow-sm">
        <div className="h-2 bg-gradient-to-l from-teal-500 via-teal-400 to-emerald-300" />

        <CardContent className="p-6">
          <div className="flex items-start gap-4 min-w-0">
            <Avatar className="hidden sm:flex h-14 w-14 rounded-xl border-2 border-stone-200 shadow-sm">
              <AvatarFallback className="rounded-xl bg-gradient-to-br from-teal-50 to-emerald-100 text-teal-700">
                <Truck className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            <div className="space-y-4 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-stone-900 truncate">بيع #{sale.id}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                  <CreditCard className="h-3 w-3" />
                  {sale.payment_type}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg bg-stone-50 border border-stone-100 p-3">
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    التاريخ
                  </div>
                  <DateDisplay date={sale.date} className="text-sm font-medium text-stone-800" />
                </div>

                <div className="rounded-lg bg-stone-50 border border-stone-100 p-3">
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                    <User className="h-3.5 w-3.5" />
                    المشتري
                  </div>
                  <p className="text-sm font-medium text-stone-800 truncate">{sale.party?.name || '—'}</p>
                </div>

                <div className="rounded-lg bg-stone-50 border border-stone-100 p-3">
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                    <Sprout className="h-3.5 w-3.5" />
                    المحصول
                  </div>
                  <p className="text-sm font-medium text-stone-800 truncate">{sale.harvest?.land_season?.crop?.name || '—'}</p>
                </div>

                <div className="rounded-lg bg-stone-50 border border-stone-100 p-3">
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    الأرض
                  </div>
                  <p className="text-sm font-medium text-stone-800 truncate">{sale.harvest?.land_season?.land?.name || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-lg bg-gradient-to-br from-stone-50 to-stone-100/50 border border-stone-200 p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 mb-1">
                    <Package className="h-3.5 w-3.5" />
                    الكمية
                  </div>
                  <p className="font-mono text-lg font-bold text-stone-800">{sale.quantity}</p>
                </div>
                <div className="text-center border-x border-stone-200">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 mb-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    سعر الوحدة
                  </div>
                  <p className="font-mono text-lg font-bold text-stone-800">{Number(sale.unit_price).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 mb-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    الإجمالي
                  </div>
                  <p className="font-mono text-lg font-bold text-teal-700">{currency(sale.total)}</p>
                </div>
              </div>

              {sale.notes && (
                <p className="text-sm text-stone-600 bg-amber-50/70 border border-amber-200/50 p-3 rounded-lg">
                  {sale.notes}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {screenshot && (
        <Card className="overflow-hidden border-stone-200 shadow-sm">
          <div className="h-1.5 bg-gradient-to-l from-teal-400 to-emerald-300" />
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="h-4 w-4 text-teal-600" />
              <h2 className="text-sm font-semibold text-stone-700">اسكرين شوت</h2>
            </div>
            <button
              type="button"
              onClick={() => setPreviewUrl(screenshot.url)}
              className="group relative w-full overflow-hidden rounded-lg border border-stone-200 bg-stone-50"
            >
              <img
                src={screenshot.url}
                alt="اسكرين شوت"
                className="max-h-64 w-full object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                <span className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  اضغط للتكبير
                </span>
              </div>
            </button>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!previewUrl} onOpenChange={(open) => { if (!open) setPreviewUrl(null); }}>
        <DialogContent className="max-w-4xl">
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
