import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { COST_BORNE_BY } from '@/lib/landEnums';

const COST_TYPES = ['بذور', 'أسمدة', 'عمالة', 'ري', 'مبيدات', 'حصاد', 'نقل', 'إيجار', 'خدمات', 'صيانة', 'أخرى'];

interface Option { id: number; name: string }

interface CostFormData {
  land_id?: string;
  land_season_id?: string;
  type: string;
  description: string;
  amount: string;
  date: string;
  notes: string;
  borne_by?: string;
}

interface CostFormProps {
  data: CostFormData;
  setData: (key: string, value: string) => void;
  errors: Record<string, string>;
  processing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  lands?: Option[];
  seasons?: Option[];
  hideLand?: boolean;
  hideSeason?: boolean;
}

export default function CostForm({ data, setData, errors, processing, onSubmit, submitLabel, lands, seasons, hideLand, hideSeason }: CostFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {lands && !hideLand && (
          <div className="space-y-2">
            <Label htmlFor="land_id">الأرض</Label>
            <Select value={data.land_id} onValueChange={(v) => setData('land_id', v)}>
              <SelectTrigger id="land_id">
                <SelectValue placeholder="اختر الأرض" />
              </SelectTrigger>
              <SelectContent>
                {lands.map((l) => (
                  <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.land_id && <p className="text-sm text-rose-600">{errors.land_id}</p>}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="type">نوع التكلفة</Label>
          <Select value={data.type} onValueChange={(v) => setData('type', v)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              {COST_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-rose-600">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="borne_by">يتحملها</Label>
          <Select value={data.borne_by ?? 'مشترك'} onValueChange={(v) => setData('borne_by', v)}>
            <SelectTrigger id="borne_by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COST_BORNE_BY.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.borne_by && <p className="text-sm text-rose-600">{errors.borne_by}</p>}
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

        {seasons && !hideSeason && (
          <div className="space-y-2">
            <Label htmlFor="land_season_id">الموسم</Label>
            <Select value={data.land_season_id} onValueChange={(v) => setData('land_season_id', v)}>
              <SelectTrigger id="land_season_id">
                <SelectValue placeholder="اختر الموسم" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.land_season_id && <p className="text-sm text-rose-600">{errors.land_season_id}</p>}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">بيان التكلفة</Label>
        <Textarea
          id="description"
          rows={3}
          value={data.description}
          onChange={(e) => setData('description', e.target.value)}
        />
        {errors.description && <p className="text-sm text-rose-600">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea
          id="notes"
          rows={3}
          value={data.notes ?? ''}
          onChange={(e) => setData('notes', e.target.value)}
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
