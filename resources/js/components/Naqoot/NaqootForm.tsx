import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const DIRECTIONS = [
  { value: 'لنا', label: 'لنا' },
  { value: 'علينا', label: 'علينا' },
];

interface NaqootFormData {
  name: string;
  date: string;
  amount: string;
  direction: string;
  notes: string;
}

interface NaqootFormProps {
  data: NaqootFormData;
  setData: (key: string, value: string) => void;
  errors: Record<string, string>;
  processing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}

export default function NaqootForm({ data, setData, errors, processing, onSubmit, submitLabel }: NaqootFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">اسم المنقوط</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            placeholder="مثال: أحمد محمد"
          />
          {errors.name && <p className="text-sm text-rose-600">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="direction">الاتجاه</Label>
          <Select value={data.direction} onValueChange={(v) => setData('direction', v)}>
            <SelectTrigger id="direction">
              <SelectValue placeholder="اختر الاتجاه" />
            </SelectTrigger>
            <SelectContent>
              {DIRECTIONS.map((d) => (
                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.direction && <p className="text-sm text-rose-600">{errors.direction}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">المبلغ</Label>
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
          <Label htmlFor="date">التاريخ</Label>
          <Input
            id="date"
            type="date"
            value={data.date}
            onChange={(e) => setData('date', e.target.value)}
          />
          {errors.date && <p className="text-sm text-rose-600">{errors.date}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea
          id="notes"
          rows={3}
          value={data.notes}
          onChange={(e) => setData('notes', e.target.value)}
          placeholder="اختياري"
        />
      </div>

      <div className="flex justify-start gap-3 border-t border-stone-200 pt-6">
        <Button type="submit" disabled={processing} className="bg-emerald-700 hover:bg-emerald-800">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}