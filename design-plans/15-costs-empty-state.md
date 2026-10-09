# خطة 15 — أيقونة حالة فراغ التكاليف (`Wallet` الموجودة)

- الحالة: منفذة (Done — أيقونة `Wallet` الموجودة، `tsc --noEmit` ناجح)
- الكوميت المرجعي (Commit = نسخة الكود): `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح المدقق (Surface): صف الفراغ في جدول `Costs/Index`
- الأولوية: 2 (آخر فراغ نصي — 3 شواهد بالأيقونة)

## المشكلة (Problem)
فراغ التكاليف نص فقط — آخر مخالف بعد توحيد `Purchases` و`ContractsTable` و`Sales` (الخطة 13) على أيقونة + `py-16`.

## الدليل (Evidence)
- العقد (Contract): 3 مقابل 1 في نفس العائلة.
- التشغيل (Runtime) — `resources/js/pages/Costs/Index.tsx:85-90`:
```tsx
<TableCell colSpan={6} className="py-16 text-center text-stone-500">
  لا توجد تكاليف مسجّلة بعد.
</TableCell>
```
- لا اختراع ولا استيراد: `Wallet` مستوردة already سطر 2 (أيقونة بطاقة الملخص) — أنسب أيقونة مالية موجودة.

## التغيير المقترح (كتلة الفراغ فقط)
```tsx
<TableCell colSpan={6} className="py-16 text-center text-stone-500">
  <Wallet className="mx-auto mb-3 h-10 w-10 text-stone-300" />
  لا توجد تكاليف مسجّلة بعد.
</TableCell>
```

## خطوات المنفذ (Executor)
1. افتح `Costs/Index.tsx` كتلة الفراغ.
2. أضف سطر الأيقونة كما أعلاه.
3. احفظ.

## التحقق (Verification)
1. افتح `/costs` بلا بيانات — أيقونة محفظة + نص مثل `/purchases`.
2. `npx tsc --noEmit` ينجح. بصري فقط.

## خارج النطاق
- زر إجراء داخل الفراغ — قرار منتج، مؤجل عمداً.
