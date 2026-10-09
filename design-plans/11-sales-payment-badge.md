# خطة 11 — شارة `StatusBadge` لنوع الدفع في جدول المبيعات

- الحالة: منفذة (Done — استيراد + رأس + خلية، `tsc --noEmit` ناجح)
- الكوميت المرجعي (Commit = نسخة الكود): `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح المدقق (Surface): عمود `نوع الدفع` في `Sales/Index`
- الأولوية: 1 (شاهدان حيّان — `Purchases` و`SeasonShow`)

## المشكلة (Problem)
نفس الحقل (`payment_type`) يظهر نصاً عارياً في المبيعات وشارة في المشتريات وجدول مبيعات الموسم — لغة بصرية مكسورة لنفس البيانات.

## الدليل (Evidence)
- العقد (Contract): تناقض عرض نفس الحقل بين جداول شقيقة.
- التشغيل (Runtime):
  - الشاذ: `pages/Sales/Index.tsx:111` — `<TableCell>{sale.payment_type}</TableCell>` ورأس يمين `:83`
  - القاعدة: `pages/Purchases/Index.tsx:54` (رأس متمركز) + `:77-81` (شارة متمركزة) و`pages/Lands/SeasonShow.tsx:285` (`<StatusBadge value={s.payment_type} />` — آمن على نفس البيانات)
- لا اختراع: `StatusBadge` وموضعه المركزي منسوخان من `Purchases` حرفياً.

## التغيير المقترح (عمود واحد: استيراد + رأس + خلية)
1. أضف الاستيراد (نمط `Purchases:3`):
```tsx
import StatusBadge from '@/components/Lands/StatusBadge';
```
2. الرأس (`:83`):
```tsx
// قبل:
<TableHead className="text-right">نوع الدفع</TableHead>
// بعد:
<TableHead className="text-center">نوع الدفع</TableHead>
```
3. الخلية (`:111`):
```tsx
// قبل:
<TableCell>{sale.payment_type}</TableCell>
// بعد:
<TableCell className="text-center"><StatusBadge value={sale.payment_type} /></TableCell>
```

## خطوات المنفذ (Executor)
1. افتح `Sales/Index.tsx` — أضف الاستيراد، عدّل الرأس والخلية كما أعلاه.
2. احفظ. لا تمس باقي الأعمدة.

## التحقق (Verification)
1. افتح `/sales` — عمود نوع الدفع شارات متمركزة مثل `/purchases`.
2. قيمة غير مصنفة تظهر شارة حجرية محايدة (fallback المالك) — لا كسر.
3. `npx tsc --noEmit` ينجح. بصري فقط.

## خارج النطاق
- ألوان `toneMap` لأنواع الدفع — افتراضي المالك يكفي، تخصيص لاحق إن طلب.
