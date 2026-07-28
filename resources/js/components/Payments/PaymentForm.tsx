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
import { PAYMENT_TYPES } from '@/lib/paymentEnums';
import { CATEGORY_ALLOWED_PAYMENT_TYPES } from '@/lib/partyEnums';

interface Party {
  id: number;
  name: string;
  category: string | null;
}

interface Contract {
  id: number;
  type: string;
  amount: number;
  paid_amount: number;
  remaining: number;
  party: { id: number; name: string };
  land: { id: number; name: string };
}

interface PaymentFormData {
  party_id: string;
  contract_id: string;
  type: string;
  date: string;
  amount: string;
  notes: string;
}

interface PaymentFormProps {
  data: PaymentFormData;
  setData: (key: string, value: string) => void;
  errors: Record<string, string>;
  processing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  parties: Party[];
  contracts?: Contract[];
}

export default function PaymentForm({ data, setData, errors, processing, onSubmit, submitLabel, parties, contracts = [] }: PaymentFormProps) {
  const partyContracts = contracts.filter((c) => c.party.id === Number(data.party_id));

  const selectedParty = parties.find((p) => p.id === Number(data.party_id));
  const allowedTypes = selectedParty?.category
    ? PAYMENT_TYPES.filter((t) => (CATEGORY_ALLOWED_PAYMENT_TYPES[selectedParty.category] ?? []).includes(t.value))
    : PAYMENT_TYPES;

  function handleContractChange(contractId: string) {
    setData('contract_id', contractId);
    if (contractId) {
      const contract = contracts.find((c) => c.id === Number(contractId));
      if (contract) {
        if (contract.type === 'مؤجر') setData('type', 'دفع');
        else if (contract.type === 'مستأجر') setData('type', 'قبض');
        else setData('type', '');
      }
    }
  }

  function handlePartyChange(v: string) {
    setData('party_id', v);
    setData('contract_id', '');
    setData('type', '');
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="party_id">الطرف</Label>
          <Select value={data.party_id} onValueChange={handlePartyChange}>
            <SelectTrigger id="party_id">
              <SelectValue placeholder="اختر الطرف" />
            </SelectTrigger>
            <SelectContent>
              {parties.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.party_id && <p className="text-sm text-rose-600">{errors.party_id}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contract_id">العقد (اختياري)</Label>
          <Select value={data.contract_id} onValueChange={handleContractChange}>
            <SelectTrigger id="contract_id">
              <SelectValue placeholder="بدون عقد" />
            </SelectTrigger>
            <SelectContent>
              {partyContracts.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.land.name} — {c.type} ({c.remaining.toFixed(2)} متبقي)
                </SelectItem>
              ))}
              {partyContracts.length === 0 && data.party_id && (
                <SelectItem value="" disabled>لا توجد عقود لهذا الطرف</SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.contract_id && <p className="text-sm text-rose-600">{errors.contract_id}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">النوع</Label>
          <Select value={data.type} onValueChange={(v) => setData('type', v)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              {allowedTypes.length > 0 ? (
                allowedTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>اختر الطرف أولاً</SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-rose-600">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">التاريخ</Label>
          <Input
            id="date"
            type="date"
            className="font-mono"
            value={data.date}
            onChange={(e) => setData('date', e.target.value)}
          />
          {errors.date && <p className="text-sm text-rose-600">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">المبلغ</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            className="font-mono"
            value={data.amount}
            onChange={(e) => setData('amount', e.target.value)}
          />
          {errors.amount && <p className="text-sm text-rose-600">{errors.amount}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">ملاحظات</Label>
          <Textarea
            id="notes"
            rows={2}
            value={data.notes}
            onChange={(e) => setData('notes', e.target.value)}
          />
          {errors.notes && <p className="text-sm text-rose-600">{errors.notes}</p>}
        </div>
      </div>

      <div className="flex justify-start gap-3 border-t border-stone-200 pt-6">
        <Button type="submit" disabled={processing} className="bg-emerald-700 hover:bg-emerald-800">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
