# خطة 2 — حذف `ms-2` المضاعف من أيقونات أزرار الإضافة (كل الفهارس)

- الحالة: منفذة (Done — حذف `ms-2` من 20 زراً في 17 ملفاً، `tsc --noEmit` ناجح. مستثنى: `app-header.tsx:166` أيقونة رابط تنقل لا زر — لا يوجد `gap-2` مزدوج هناك)
- الكوميت المرجعي (Commit = نسخة الكود): `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح المدقق (Surface): كل صفحات الفهرس (Index = قائمة) التي فيها زر إضافة
- الأولوية: 2 (تباعد مضاعف 8px + 8px في 16 زراً)

## المشكلة (Problem)
مالك الزر (`Button`) يوفر تباعداً داخلياً `gap-2` (أي 8px بين الأيقونة والنص)، وكل زر إضافة يضيف `ms-2` (هامش بداية = 8px إضافية) على الأيقونة، فالمجموع 16px — تباعد مضاعف يخالف نية المالك.

## الدليل (Evidence)
- العقد (Contract): `resources/js/components/ui/button.tsx:8` — `inline-flex ... gap-2 ...` هو مصدر التباعد الوحيد المقصود.
- التشغيل (Runtime): الأيقونة داخل `Button asChild` تصل للشاشة بهامش إضافي. المواقع (16 موقعاً بنفس السبب):
  - `pages/Lands/Index.tsx:27` — `<Plus className="ms-2 h-4 w-4" />`
  - `pages/Parties/Index.tsx:32`, `pages/Products/Index.tsx:35`, `pages/Sales/Index.tsx:64`
  - `pages/Purchases/Index.tsx:42`, `pages/Payments/Index.tsx:59`, `pages/Costs/Index.tsx:39`
  - `pages/Crops/Index.tsx:75`, `pages/StockMovements/Index.tsx:109`, `pages/Naqoot/Index.tsx:56`
  - `pages/Lands/SeasonShow.tsx:172,208,258` (إضافة حصاد/تكلفة/بيع)
  - `pages/Crops/Show.tsx:85`, `pages/Payments/Show.tsx:145`, `pages/Parties/Components/PartyHeader.tsx:100` (أزرار `Pencil` تحرير)
- المالك المعاد استخدامه: `buttonVariants` في `ui/button.tsx` — لا حاجة لأي هامش يدوي.

## التغيير المقترح (تغيير واحد يكرر)
في كل موقع أعلاه، احذف `ms-2` فقط وأبق الباقي:

قبل:
```tsx
<Plus className="ms-2 h-4 w-4" />
```

بعد:
```tsx
<Plus className="h-4 w-4" />
```

- نفس الشيء لأيقونة `Pencil` في مواقع التحرير.
- لا تغير `variant` ولا `size` ولا نص الزر.
- لا تمس `ui/button.tsx`.

## خطوات المنفذ (Executor)
1. ابحث عن `ms-2 h-4 w-4` في `resources/js/pages` و`resources/js/components` (القائمة أعلاه كاملة بتاريخ الكوميت).
2. في كل زر داخل `Button` (إضافة/تحرير)، احذف `ms-2` من `className` الأيقونة فقط.
3. احفظ. لا تضف `gap-*` جديد — `gap-2` من المالك يكفي.

## التحقق (Verification)
1. افتح `/lands` و`/parties` و`/sales` — المسافة بين الأيقونة والنص 8px واحدة متناسقة.
2. `npx tsc --noEmit` ينجح.
3. لا تغيير سلوكي — بصري فقط.

## خارج النطاق
- توحيد لون الزر (`bg-emerald-700` اليدوي مقابل `variant`) — يحتاج قرار توكن منفصل، مؤجل عمداً.
- أي تعديل على حجم الأيقونة (`h-4 w-4` يبقى كما هو رغم أن المالك يضبط `[&_svg]:size-4`).
