import { type ReactNode } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CONTRACT_TYPES, SETTLEMENT_TYPES } from '@/lib/landEnums';

interface Contract {
  id?: number;
  type?: string;
  settlement_type?: string | null;
  share_percentage?: string | null;
  start_date?: string;
  end_date?: string;
  amount?: string;
  notes?: string;
  party_id?: number | null;
}

interface ContractFormDialogProps {
  landId: number;
  parties: { id: number; name: string; type: string; phone: string | null }[];
  contract?: Contract | null;
  trigger: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function toDateInputValue(dateStr?: string): string {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
}

export default function ContractFormDialog({ landId, parties, contract = null, trigger, open, onOpenChange }: ContractFormDialogProps) {
  const isEditing = Boolean(contract);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    land_id: landId,
    party_id: contract?.party_id?.toString() ?? '',
    type: contract?.type ?? 'مؤجر',
    settlement_type: contract?.settlement_type ?? '',
    share_percentage: contract?.share_percentage ?? '',
    start_date: toDateInputValue(contract?.start_date),
    end_date: toDateInputValue(contract?.end_date),
    amount: contract?.amount ?? '',
    notes: contract?.notes ?? '',
  });

  const isFarmerContract = data.type === 'مزارع';

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (isEditing) {
      put(route('lands.contracts.update', contract!.id), { onSuccess: () => reset() });
    } else {
      post(route('lands.contracts.store'), { onSuccess: () => reset() });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent dir="rtl" className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'تعديل العقد' : 'إضافة عقد جديد'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="party_id">الطرف</Label>
            <Select value={data.party_id} onValueChange={(v) => setData('party_id', v)}>
              <SelectTrigger id="party_id">
                <SelectValue placeholder="اختر الطرف..." />
              </SelectTrigger>
              <SelectContent>
                {parties.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.name} ({p.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.party_id && <p className="text-sm text-rose-600">{errors.party_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contract_type">نوع العقد</Label>
            <Select value={data.type} onValueChange={(v) => setData('type', v)}>
              <SelectTrigger id="contract_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTRACT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-rose-600">{errors.type}</p>}
          </div>

          {isFarmerContract && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="settlement_type">نوع التسوية</Label>
                <Select value={data.settlement_type} onValueChange={(v) => setData('settlement_type', v)}>
                  <SelectTrigger id="settlement_type">
                    <SelectValue placeholder="اختر..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SETTLEMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.settlement_type && <p className="text-sm text-rose-600">{errors.settlement_type}</p>}
              </div>

              {data.settlement_type === 'نسبة' && (
                <div className="space-y-2">
                  <Label htmlFor="share_percentage">نسبة المزارع (%)</Label>
                  <Input
                    id="share_percentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="font-mono"
                    value={data.share_percentage}
                    onChange={(e) => setData('share_percentage', e.target.value)}
                  />
                  {errors.share_percentage && <p className="text-sm text-rose-600">{errors.share_percentage}</p>}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">تاريخ البداية</Label>
              <Input
                id="start_date"
                type="date"
                value={data.start_date}
                onChange={(e) => setData('start_date', e.target.value)}
              />
              {errors.start_date && <p className="text-sm text-rose-600">{errors.start_date}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">تاريخ الانتهاء (اختياري)</Label>
              <Input
                id="end_date"
                type="date"
                value={data.end_date}
                onChange={(e) => setData('end_date', e.target.value)}
              />
              {errors.end_date && <p className="text-sm text-rose-600">{errors.end_date}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">القيمة</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              className="font-mono"
              value={data.amount}
              onChange={(e) => setData('amount', e.target.value)}
            />
            {errors.amount && <p className="text-sm text-rose-600">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contract_notes">ملاحظات</Label>
            <Textarea id="contract_notes" rows={3} value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={processing} className="bg-emerald-700 hover:bg-emerald-800">
              {isEditing ? 'حفظ التعديلات' : 'إضافة العقد'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
