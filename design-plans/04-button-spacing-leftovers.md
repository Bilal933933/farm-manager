# خطة 4 — حذف بقايا `ms-*` المضاعفة من 5 أزرار (استكمال الخطة 2)

- الحالة: منفذة (Done — 5 أزرار، `tsc --noEmit` ناجح)
- الكوميت المرجعي (Commit = نسخة الكود): `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح المدقق (Surface): عائلة `Lands/Show` + زر فلتر مشترك + بطاقتا رأس (منتجات/تكاليف)
- الأولوية: 1 (نفس علة الخطة 2 المنفذة — تصحيح ميكانيكي، صفر خطر)

## المشكلة (Problem)
5 أزرار ما زالت تجمع `gap-2` من مالك `Button` (أي 8px) مع هامش بداية يدوي `ms-*` على الأيقونة (4-8px إضافية)، فالتباعد 12-16px بدل 8px المقصودة. فاتت من الخطة 2 لأنها خارج `pages/*` المباشرة (مكونات + صفحة عرض).

## الدليل (Evidence)
- العقد (Contract): `resources/js/components/ui/button.tsx:8` — `inline-flex ... gap-2 ...` مصدر التباعد الوحيد.
- التشغيل (Runtime) — كلها أيقونة داخل `Button` مباشرة:
  - `components/Lands/LandHeader.tsx:38` — `<Pencil className="ms-1.5 h-3.5 w-3.5" />` داخل زر تعديل `outline asChild`
  - `pages/Costs/Show.tsx:52` — `<Pencil className="ms-1.5 h-3.5 w-3.5" />` داخل زر تعديل `outline asChild`
  - `pages/Products/Components/ProductHeaderCard.tsx:62` — `<Pencil className="ms-2 h-3.5 w-3.5 text-stone-500" />` داخل زر `outline asChild`
  - `components/Purchases/PurchaseForm.tsx:126` — `<Plus className="ms-1 h-4 w-4" />` داخل زر `outline onClick`
  - `components/Filters/SeasonFilter.tsx:102` — `<X className="ms-1 h-4 w-4" />` داخل زر `outline onClick`
- مستثنى عمداً: `app-header.tsx:166` (رابط لا زر)، محركات التحميل `Show.tsx:107,118,136` (الهامش هو التباعد الوحيد — الأب `flex` بلا `gap`)، `user-menu-content` (عناصر قائمة لا أزرار).

## التغيير المقترح (تغيير واحد يكرر 5 مرات)
احذف هامش البداية فقط، وأبق الحجم وأي لون:

| الملف | قبل | بعد |
|-------|-----|-----|
| `LandHeader.tsx:38` | `ms-1.5 h-3.5 w-3.5` | `h-3.5 w-3.5` |
| `Costs/Show.tsx:52` | `ms-1.5 h-3.5 w-3.5` | `h-3.5 w-3.5` |
| `ProductHeaderCard.tsx:62` | `ms-2 h-3.5 w-3.5 text-stone-500` | `h-3.5 w-3.5 text-stone-500` |
| `PurchaseForm.tsx:126` | `ms-1 h-4 w-4` | `h-4 w-4` |
| `SeasonFilter.tsx:102` | `ms-1 h-4 w-4` | `h-4 w-4` |

- لا تمس `variant` ولا `size` ولا النص ولا `ui/button.tsx`.

## خطوات المنفذ (Executor)
1. افتح الملفات الخمسة عند الأسطر أعلاه.
2. احذف توكن الهامش (`ms-1.5`/`ms-2`/`ms-1`) من `className` الأيقونة فقط.
3. احفظ. لا تضف أي `gap-*` — `gap-2` من المالك يكفي.

## التحقق (Verification)
1. بحث `ms-1 h-4 w-4|ms-1.5|ms-2 h-3.5` في الأزرار: صفر (يبقى `app-header` المستثنى).
2. افتح `/lands/1` و`/costs/1` ومنتَج ونموذج شراء — مسافة واحدة 8px بين الأيقونة والنص.
3. `npx tsc --noEmit` ينجح. بصري فقط.

## خارج النطاق
- `appearance-tabs.tsx:39-40` (`-ms-1`/`ms-1.5` داخل نظام التبويبات الخاص) — مالك مختلف، يحتاج تدقيقاً مستقلاً.
- توحيد لون الزر اليدوي `bg-emerald-700` — مؤجل (يحتاج قرار توكن).
