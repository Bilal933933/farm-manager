# خطة 5 — تنسيق رقم الحصاد بـ `fmt()` في جدول المواسم (SeasonsTab)

- الحالة: منفذة (Done — سطر واحد، `tsc --noEmit` ناجح)
- الكوميت المرجعي (Commit = نسخة الكود): `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح المدقق (Surface): تبويب المواسم في صفحة الأرض `Lands/Show`
- الأولوية: 2 (رقم واحد شاذ بنفس الصف — إصلاح سطر واحد)

## المشكلة (Problem)
خلية "الحصاد" تعرض الرقم خاماً بلا فواصل آلاف (`1500`)، بينما خلايا "المبيعات/التكلفة/الربح" بنفس الصف تعرض بفواصل (`1,500`) — نفس الأرقام تُقرأ بشكلين مختلفين جنباً إلى جنب.

## الدليل (Evidence)
- العقد (Contract): تناقض عرض مباشر داخل نفس الصف لنفس نوع البيانات (أرقام).
- التشغيل (Runtime) — `resources/js/components/Lands/Tabs/SeasonsTab.tsx`:
  - سطر 120 (شاذ): `{harvest > 0 ? harvest : '—'}`
  - سطور 121-124 (القاعدة): `{salesTotal > 0 ? fmt(salesTotal) : '—'}` و`{cost > 0 ? fmt(cost) : '—'}` و`{profit !== 0 ? fmt(profit) : '—'}`
  - الدالة `fmt` موجودة بنفس الملف سطور 52-54: `function fmt(n: number) { return n.toLocaleString() }`
  - الشاهد الخارجي: نفس الحقل يُنسق بـ `fmt` في `pages/Lands/SeasonShow.tsx:194` — `SeasonsTab:120` هو الشاذ الوحيد.
- لا اختراع: `fmt` والدالة والنمط كلها موجودة وnamed بالضبط.

## التغيير المقترح (سطر واحد)
في `resources/js/components/Lands/Tabs/SeasonsTab.tsx:120`:

قبل:
```tsx
<TableCell className={numCell}>{harvest > 0 ? harvest : '—'}</TableCell>
```

بعد:
```tsx
<TableCell className={numCell}>{harvest > 0 ? fmt(harvest) : '—'}</TableCell>
```

- لا شيء آخر. `harvest` رقم (`const harvest = st?.total_harvest ?? 0` سطر 105) فيطابق توقيع `fmt(n: number)`.

## خطوات المنفذ (Executor)
1. افتح `SeasonsTab.tsx` سطر 120.
2. غلّف `harvest` بـ `fmt(...)`.
3. احفظ.

## التحقق (Verification)
1. افتح أرضاً بحصاد ≥ 1000 — عمود الحصاد بفواصل مثل جيرانه.
2. بحث `? harvest :` في الملف: صفر نتائج.
3. `npx tsc --noEmit` ينجح. بصري فقط.

## خارج النطاق
- توحيد `fmt` بين الملفات (`toLocaleString` هنا مقابل `Intl en-US` في `KpiCards`) — يحتاج قرار تنسيق أرقام عام، مؤجل عمداً.
- دالة `getCropName` المكررة (`Show`/`ActiveSeasonCard`/`SeasonsTab`) — جودة كود لا تصميم، مرفوضة حسب المهارة.
