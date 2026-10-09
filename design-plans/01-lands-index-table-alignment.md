# خطة 1 — توحيد محاذاة رأسي المواسم والعقود (Lands/Index)

- الحالة: منفذة (Done — طبق سطران 47-48، `tsc --noEmit` ناجح)
- الكوميت المرجعي (Commit = نسخة الكود): `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح المدقق (Surface = الصفحة): `resources/js/pages/Lands/Index.tsx` + `resources/js/components/Lands/LandTableRow.tsx`
- الأولوية: 1 (أعلى leverage — سطران، قاعدة تعمم على كل الجداول)

## المشكلة (Problem)
رأسا عمودي "المواسم" و"العقود" بمحاذاة يمين (`text-right`) بينما خليتا الجسم متمركزتان (`text-center`)، فينكسر العمود بصرياً في نفس الجدول.

## الدليل (Evidence)
- العقد (Contract = القاعدة الملزمة): تناقض عرض مباشر داخل نفس الجدول لنفس العمود — الرأس يمين والجسم وسط.
- التشغيل (Runtime = مسار وصول الكود للشاشة):
  - `pages/Lands/Index.tsx:47-48` — `<TableHead className="text-right">المواسم</TableHead>` و `<TableHead className="text-right">العقود</TableHead>`
  - `components/Lands/LandTableRow.tsx:25-26` — `<TableCell className="font-mono text-center tabular-nums">` للعددين
- المالك المعاد استخدامه (Owner = المكون الحاكم): `components/ui/table.tsx` — `TableHead` افتراضياً `text-left`، والتجاوز هنا يدوي لكل عمود، والخلايا تستخدم توكن `text-center` الموجود.

## التغيير المقترح (تغيير واحد فقط)
في `resources/js/pages/Lands/Index.tsx` فقط، غيّر سطرين:

قبل:
```tsx
<TableHead className="text-right">المواسم</TableHead>
<TableHead className="text-right">العقود</TableHead>
```

بعد:
```tsx
<TableHead className="text-center">المواسم</TableHead>
<TableHead className="text-center">العقود</TableHead>
```

- لا تمس `LandTableRow.tsx` (الخلايا صحيحة).
- لا تمس `ui/table.tsx` (المالك سليم).
- لا تضف توكنات جديدة — `text-center` مستخدم already في نفس الملف للخلايا.

## الأسطح المتأثرة
- `Lands/Index` فقط. تحقق أن `Costs/Index` و`Sales/Index` لها نفس النمط لكنها خارج نطاق هذه الخطة (تعمم لاحقاً بنفس القاعدة).

## خطوات المنفذ (Executor = من يطبق الخطة)
1. افتح `resources/js/pages/Lands/Index.tsx` عند الأسطر 47-48.
2. بدّل `text-right` إلى `text-center` في الرأسين فقط.
3. احفظ. لا تعدل أي ملف آخر.

## التحقق (Verification)
1. افتح `/lands` — عمودا المواسم والعقود: الرأس فوق الأرقام تماماً بالوسط.
2. `npx tsc --noEmit` ينجح (لا خطأ أنواع).
3. لا يوجد تغيير سلوكي (Behavior = ما يفعله الزر/الحذف) — بصري فقط.

## خارج النطاق
- عمود "إجراءات" (`text-left`) — يعالج في مراجعة RTL مستقلة إن طلبت.
- أي تعديل على `StatusBadge` أو `DetailCell` أو `ActionsMenu`.
