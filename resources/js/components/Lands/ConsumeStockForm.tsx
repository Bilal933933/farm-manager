import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { StockProductOption } from '@/types';

interface SeasonOption { id: number; name: string }

interface ConsumeStockFormData {
  product_id: string;
  land_season_id: string;
  quantity: string;
  unit_price: string;
  date: string;
  notes: string;
}

interface Props {
  data: ConsumeStockFormData;
  setData: (key: string, value: string) => void;
  errors: Record<string, string>;
  processing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  products: StockProductOption[];
  seasons: SeasonOption[];
}

export default function ConsumeStockForm({ data, setData, errors, processing, onSubmit, products, seasons }: Props) {
  function onProductChange(productId: string) {
    setData('product_id', productId);

    const product = products.find((p) => p.id.toString() === productId);

    if (product?.last_purchase_price != null) {
      setData('unit_price', product.last_purchase_price.toString());
    }
  }

  const selectedProduct = products.find((p) => p.id.toString() === data.product_id);
  const total = (Number(data.quantity) || 0) * (Number(data.unit_price) || 0);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product_id">المنتج</Label>
          <Select value={data.product_id} onValueChange={onProductChange}>
            <SelectTrigger id="product_id">
              <SelectValue placeholder="اختر المنتج" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.product_id && <p className="text-sm text-rose-600">{errors.product_id}</p>}
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="quantity">الكمية {selectedProduct ? `(${selectedProduct.unit})` : ''}</Label>
          <Input
            id="quantity"
            type="number"
            step="0.01"
            min="0"
            className="font-mono"
            value={data.quantity}
            onChange={(e) => setData('quantity', e.target.value)}
          />
          {errors.quantity && <p className="text-sm text-rose-600">{errors.quantity}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_price">سعر الوحدة</Label>
          <Input
            id="unit_price"
            type="number"
            step="0.01"
            min="0"
            className="font-mono"
            value={data.unit_price}
            onChange={(e) => setData('unit_price', e.target.value)}
          />
          {errors.unit_price && <p className="text-sm text-rose-600">{errors.unit_price}</p>}
          {selectedProduct?.last_purchase_price != null && (
            <p className="text-xs text-stone-500">آخر سعر شراء: {selectedProduct.last_purchase_price.toLocaleString()}</p>
          )}
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

        <div className="space-y-2">
          <Label>إجمالي التكلفة</Label>
          <p className="font-mono text-lg font-semibold text-amber-700">{total.toLocaleString()}</p>
        </div>
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
          صرف من المخزون
        </Button>
      </div>
    </form>
  );
}
