# خطة 9 — إحياء تلوين عدّاد التبويب النشط (`group-data`) في Parties/Show

- الحالة: منفذة (Done — `group` + منتقيّ `group-data`، `tsc --noEmit` ناجح)
- الكوميت المرجعي (Commit = نسخة الكود): `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح المدقق (Surface): تبويبات `Parties/Show` اللاصقة
- الأولوية: 3 (كود ميت — العدّاد لا يتلون أبداً خلاف نية الكود)

## المشكلة (Problem)
منتقيّ `data-[state=active]:bg-emerald-100` و`data-[state=active]:text-emerald-700` على `span` العدّاد لا يطابقان أبداً، لأن خاصية `data-state` يضعها Radix على زر `TabsTrigger` الأب لا على الـ `span` — فعدّاد التبويب النشط يبقى رمادياً دائماً خلاف ما أراد الكود.

## الدليل (Evidence)
- العقد (Contract): نية الكود نفسه سطر 178 + المنتقي الشغال على الأب سطر 173 (`data-[state=active]:bg-white` يعمل لأنه على نفس العنصر الحامل للخاصية).
- التشغيل (Runtime) — `resources/js/pages/Parties/Show.tsx:170-182`:
  - الزر يحمل `data-state` من Radix (سطور 170-176، بلا `group`)
  - الـ `span` سطور 178-180 يحمل منتقيين ميتين
- المالك المثبت: نمط `group-data-[...]` مستخدم ويُبنى بنجاح في `components/ui/sidebar.tsx` (مثل `group-data-[collapsible=icon]:...`) — نفس المحرك Tailwind v4.

## التغيير المقترح (سطران منطقياً واحد)
في `Show.tsx`:

1. أضف `group` لأول `className` زر `TabsTrigger` (سطر ~173):
```tsx
className="flex items-center gap-2 ... group ..."
```
(أضف توكن `group` وحده لأي موضع في السلسلة — الأفضل أولها.)

2. بدّل منتقيّ الـ `span` (سطر 178):
```tsx
// قبل:
className="... data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
// بعد:
className="... group-data-[state=active]:bg-emerald-100 group-data-[state=active]:text-emerald-700"
```

- لا تمس منطق `defaultTab` ولا العدّادات ولا `TabsList` اللاصقة.

## خطوات المنفذ (Executor)
1. افتح `Show.tsx` أسطر 169-184.
2. أضف `group` لكلاس `TabsTrigger`.
3. بدّل البادئة `data-` ← `group-data-` في كلاس الـ `span`.
4. احفظ.

## التحقق (Verification)
1. افتح أي طرف عام (بلا دور خاص) — بدّل التبويبات: عدّاد النشط يصبح زمردياً، الباقي رمادي.
2. `npx tsc --noEmit` ينجح. بصري فقط (لا منطق تبويبات تغير).

## خارج النطاق
- تبويبات `Lands/Show` (افتراضية بلا عدّادات ملوّنة) — نظام مختلف، لا يمس.
- سلوك `defaultTab` — منطق لا بصريات.
