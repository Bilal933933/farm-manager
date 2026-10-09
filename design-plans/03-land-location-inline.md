# خطة 3 — عرض موقع الأرض كنص مختصر بدل أيقونة Hover (LandTableRow)

- الحالة: منفذة (Done — نص مختصر بدل الأيقونة + حذف الاستيراد، `tsc --noEmit` ناجح. `DetailCell` بقيت لمواضع الملاحظات)
- الكوميت المرجعي (Commit = نسخة الكود): `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح المدقق (Surface): عمود "الموقع" في `Lands/Index`
- الأولوية: 3 (يكسر مهمة مسح المواقع — قارئ الجدول لا يرى أي موقع بدون وقوف)

## المشكلة (Problem)
عمود الموقع يعرض أيقونة فقط (`ScrollText`) تتطلب Hover لرؤية القيمة، بينما الخلية الفارغة تعرض `—` نصاً. النتيجة: مسح (Scan = نظرة سريعة على العمود) المواقع مستحيل، والعمود يبدو فارغاً دائماً.

## الدليل (Evidence)
- العقد (Contract): تناقضان مباشران —
  1. داخل نفس العمود: ممتلئ = أيقونة، فارغ = نص `—` (`detail-cell.tsx:20-22` مقابل `24-46`).
  2. مع شقيقة تعرض نفس نوع البيانات كنص مباشر: `pages/Sales/Index.tsx:105-106` تعرض `{sale.harvest?.land_season?.land?.name || '—'}` كنص.
- التشغيل (Runtime): `components/Lands/LandTableRow.tsx:21` — `<TableCell><DetailCell text={land.location} title="الموقع" className="text-stone-500" /></TableCell>` ← `components/ui/detail-cell.tsx:24-46` يرسم زر أيقونة + `HoverCard`.
- النموذج المحتذى (Exemplar = مثال جاهز ننسخ منه): نفس الخاصية `land.location` معروضة كنص مختصر في `components/Lands/LandHeader.tsx:30`:
  ```tsx
  <p className="truncate text-sm text-stone-500">{land.location || 'لا يوجد موقع مسجّل'}</p>
  ```
  وتوكن `truncate` مستخدم في 32 موضعاً بالكود (مثبت، لا اختراع).
- فحص مضاد: `DetailCell` صحيح في 10 مواضع أخرى (ملاحظات/بيان طويلة: `Costs/Index:96`, `Payments/Index:108`, `Ledger/Index:75`, `SeasonShow:197,230,235,286`...) — لذلك لا نمس البدائية، فقط استعمال الموقع الشاذ.

## التغيير المقترح (تغيير واحد في ملف واحد)
في `resources/js/components/Lands/LandTableRow.tsx` فقط:

قبل (سطر 5 + سطر 21):
```tsx
import DetailCell from '@/components/ui/detail-cell';
...
<TableCell><DetailCell text={land.location} title="الموقع" className="text-stone-500" /></TableCell>
```

بعد:
```tsx
<TableCell className="max-w-40">
  <span className="block truncate text-sm text-stone-500" title={land.location ?? ''}>
    {land.location?.trim() ? land.location : '—'}
  </span>
</TableCell>
```

- احذف سطر استيراد `DetailCell` من هذا الملف فقط (لم يعد مستخدماً فيه).
- `max-w-40` و`truncate` و`text-stone-500` توكنات موجودة — لا قيم مخترعة.
- `title` الأصلي (Tooltip = تلميح المتصفح) يحافظ على رؤية النص الكامل بدون `HoverCard`.
- لا تمس `ui/detail-cell.tsx` — تبقى لمواضع الملاحظات الصحيحة.

## خطوات المنفذ (Executor)
1. افتح `resources/js/components/Lands/LandTableRow.tsx`.
2. استبدل سطر 21 بالكتلة أعلاه.
3. احذف سطر 5 (`import DetailCell ...`) إذا لم يعد مستخدماً في الملف.
4. احفظ. لا تعدل أي ملف آخر.

## التحقق (Verification)
1. افتح `/lands` — عمود الموقع يعرض نصاً مختصراً (`...` عند الطول) والفارغ `—`، والوقوف يظهر الكامل.
2. افتح `/costs` و`/payments` — أعمدة الملاحظات ما زالت أيقونة + بطاقة عائمة (لم تتأثر).
3. `npx tsc --noEmit` ينجح.

## خارج النطاق
- تعديل `DetailCell` نفسها أو تعميم النص المختصر على أعمدة الملاحظات — مرفوض، استعمالاتها صحيحة.
- إضافة عمود بحث/فلترة للمواقع — ميزة جديدة، ليست إصلاحاً بصرياً.
