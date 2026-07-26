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
import { PARTY_TYPES } from '@/lib/partyEnums';

interface PartyFormData {
  name: string;
  type: string;
  phone: string;
  email: string;
  national_id: string;
  address: string;
  notes: string;
}

interface PartyFormProps {
  data: PartyFormData;
  setData: (key: string, value: string) => void;
  errors: Record<string, string>;
  processing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}

export default function PartyForm({ data, setData, errors, processing, onSubmit, submitLabel }: PartyFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">الاسم</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            placeholder="اسم الفرد أو الشركة"
          />
          {errors.name && <p className="text-sm text-rose-600">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">النوع</Label>
          <Select value={data.type} onValueChange={(v) => setData('type', v)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              {PARTY_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-rose-600">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="national_id">الرقم القومي / السجل التجاري</Label>
          <Input
            id="national_id"
            className="font-mono"
            value={data.national_id ?? ''}
            onChange={(e) => setData('national_id', e.target.value)}
          />
          {errors.national_id && <p className="text-sm text-rose-600">{errors.national_id}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            className="font-mono"
            dir="ltr"
            value={data.phone ?? ''}
            onChange={(e) => setData('phone', e.target.value)}
            placeholder="01xxxxxxxxx"
          />
          {errors.phone && <p className="text-sm text-rose-600">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            value={data.email ?? ''}
            onChange={(e) => setData('email', e.target.value)}
            placeholder="name@example.com"
          />
          {errors.email && <p className="text-sm text-rose-600">{errors.email}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">العنوان</Label>
          <Textarea
            id="address"
            rows={2}
            value={data.address ?? ''}
            onChange={(e) => setData('address', e.target.value)}
          />
          {errors.address && <p className="text-sm text-rose-600">{errors.address}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">ملاحظات</Label>
          <Textarea
            id="notes"
            rows={3}
            value={data.notes ?? ''}
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
