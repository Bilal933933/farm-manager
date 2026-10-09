# خطة 13 — حالة فراغ المبيعات بأيقونة و`py-16` (نمط `Purchases`)

- الحالة: منفذة (Done — أيقونة + `py-16` بلا استيراد جديد، `tsc --noEmit` ناجح)
- الكوميت المرجعي (Commit = نسخة الكود): `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح المدقق (Surface): صف الفراغ في جدول `Sales/Index`
- الأولوية: 3 (كتلة واحدة — شاهدان: `Purchases` و`ContractsTable`)

## المشكلة (Problem)
فراغ المبيعات نص فقط بضغط `py-8`، بينما شقيقتاها أيقونة + `py-16` — أول تجربة للمستخدم الجديد أفقر بلا مبرر.

## الدليل (Evidence)
- العقد (Contract): تناقض حالة الفراغ في نفس العائلة (2 مقابل 1).
- التشغيل (Runtime):
  - الشاذ: `Sales/Index:88-94` — `<TableCell colSpan={9} className="py-8 text-center text-stone-500">لا توجد مبيعات مسجّلة بعد.</TableCell>`
  - القاعدة: `Purchases/Index:61-68` و`PartyContractsTable:45-54` — أيقونة `h-10/h-8 text-stone-300` + نص + `py-16`
- لا اختراع ولا استيراد جديد: `ImageIcon` مستوردة already في `Sales/Index:2` وتستخدم لزر المعاينة — يعاد استخدامها للفراغ.

## التغيير المقترح (كتلة الفراغ فقط)
قبل (`:88-94`):
```tsx
<TableRow>
  <TableCell colSpan={9} className="py-8 text-center text-stone-500">
    لا توجد مبيعات مسجّلة بعد.
  </TableCell>
</TableRow>
```

بعد (نمط `Purchases`):
```tsx
<TableRow>
  <TableCell colSpan={9} className="py-16 text-center text-stone-500">
    <ImageIcon className="mx-auto mb-3 h-10 w-10 text-stone-300" />
    لا توجد مبيعات مسجّلة بعد.
  </TableCell>
</TableRow>
```

## خطوات المنفذ (Executor)
1. افتح `Sales/Index.tsx` كتلة الفراغ.
2. استبدلها كما أعلاه.
3. احفظ.

## التحقق (Verification)
1. افتح `/sales` بلا بيانات (أو فلتر بلا نتائج) — أيقونة + نص بمساحة سخية مثل `/purchases`.
2. `npx tsc --noEmit` ينجح. بصري فقط.

## خارج النطاق
- رسالة مخصصة للفلترة بلا نتائج — ميزة نسخية مستقلة إن طلبت.
- زر إجراء داخل الفراغ — قرار منتج، مؤجل عمداً.
