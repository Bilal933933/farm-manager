# خطة 20 — `tabular-nums` لبنود فاتورة الشراء ومبلغ السجل (5 مواضع)

- الحالة: منفذة (Done — 5 مواضع، `tsc --noEmit` ناجح)
- الكوميت المرجعي: `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح: `Purchases/Show` + `Ledger/Index`
- الأولوية: 1 (امتداد الخطط 12 و19 — نفس القاعدة للمرة الثالثة)

## المشكلة
5 خلايا مبلغ بلا `tabular-nums` — آخر الجيوب بعد توحيد `Sales` و`Payments` و`Purchases/Index`.

## الدليل
- العقد: عرف `tabular-nums` للأرقام.
- التشغيل:
  - `pages/Purchases/Show.tsx:167` (الكمية)، `:168` (سعر الوحدة)، `:169-171` (الإجمالي)، `:181` (الإجمالي النهائي) — كلها `font-mono` بلا `tabular-nums`
  - `pages/Ledger/Index.tsx:80` — `<TableCell className="font-mono">{entry.amount}</TableCell>`

## التغيير (إضافة توكن واحد لكل خلية)
- بنود الفاتورة: `font-mono py-3` ← `font-mono tabular-nums py-3` (3 خلايا)، والإجمالي `font-mono text-xl font-bold` ← `font-mono tabular-nums text-xl font-bold`.
- السجل: `font-mono` ← `font-mono tabular-nums` (خلية المبلغ فقط — التاريخ يبقى كما في العرف).

## التحقق
1. `/purchases/1` و`/ledger` — أعمدة المبالغ مصطفة.
2. `npx tsc --noEmit` ناجح. بصري فقط.

## خارج النطاق
- شارة الكود `Barcode` (الأب `gap-1` بلا هامش — سليم).
- لا نتائج مدعومة أخرى: المحاذاة والفراغ والشارات والروابط مطابقة للعرف.
