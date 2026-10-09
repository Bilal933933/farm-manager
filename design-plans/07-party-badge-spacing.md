# خطة 7 — حذف `ms-1` المضاعف من أيقونتي شارة النوع (PartyHeader)

- الحالة: منفذة (Done — سطران، `tsc --noEmit` ناجح)
- الكوميت المرجعي (Commit = نسخة الكود): `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح المدقق (Surface): رأس صفحة الطرف `Parties/Show`
- الأولوية: 1 (إغلاق ملف التباعد نهائياً — سطران، نفس علة الخطط 2 و4)

## المشكلة (Problem)
شارة النوع (`فرد`/`شركة`) تجمع تباعدين: `gap-1` (أي 4px) من مالك `Badge` + هامش `ms-1` (أي 4px) على الأيقونة — المجموع 8px بدل 4px المقصودة.

## الدليل (Evidence)
- العقد (Contract): `resources/js/components/ui/badge.tsx:8` — `badgeVariants` تتضمن `gap-1` بين الأيقونة والنص.
- التشغيل (Runtime) — `resources/js/pages/Parties/Components/PartyHeader.tsx`:
  - سطر 68: `<User className="h-3 w-3 ms-1" />فرد`
  - سطر 70: `<Building2 className="h-3 w-3 ms-1" />شركة`
  - الأب `Badge variant="secondary"` سطور 63-66.
- مستثنى عمداً بعد الفحص: `Crops/Index.tsx:148` (`ms-1` هو التباعد الوحيد — الأب `span` بلا `gap`)، `user-menu-content` (عناصر قائمة لا شارات).

## التغيير المقترح (سطران)
قبل:
```tsx
<><User className="h-3 w-3 ms-1" />فرد</>
...
<><Building2 className="h-3 w-3 ms-1" />شركة</>
```

بعد:
```tsx
<><User className="h-3 w-3" />فرد</>
...
<><Building2 className="h-3 w-3" />شركة</>
```

- لا تمس `variant` ولا نص الشارة ولا `ui/badge.tsx`.

## خطوات المنفذ (Executor)
1. افتح `PartyHeader.tsx` سطري 68 و70.
2. احذف `ms-1` من `className` الأيقونة فقط.
3. احفظ.

## التحقق (Verification)
1. افتح أي طرف — المسافة بين الأيقونة والنص 4px واحدة.
2. `npx tsc --noEmit` ينجح. بصري فقط.

## خارج النطاق
- شارة الفئة `StatusBadge` بجانبها — سليمة (لا هامش يدوي).
- أفاتار الحروف الأولى — سليم.
