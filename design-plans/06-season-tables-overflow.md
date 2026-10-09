# خطة 6 — قص زوايا بطاقات جداول صفحة الموسم (`overflow-hidden`)

- الحالة: منفذة (Done — 3 بطاقات عند 175/211/262، `tsc --noEmit` ناجح)
- الكوميت المرجعي (Commit = نسخة الكود): `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح المدقق (Surface): جداول الحصاد/التكاليف/المبيعات في `Lands/SeasonShow`
- الأولوية: 3 (عيب زوايا دقيق — 3 أسطر)

## المشكلة (Problem)
بطاقة `Card` مستديرة (`rounded-xl`) وبداخلها جدول رأسه مظلل (`bg-stone-100`) عبر غلاف `overflow-auto` بلا استدارة — زوايا الرأس المربعة تخرج عن استدارة البطاقة (بروز مربع عند الزاويتين العلويتين). بطاقة جدول المواسم (`SeasonsTab`) فيها القص الصحيح، فالعيب تناقض داخل العائلة نفسها.

## الدليل (Evidence)
- العقد (Contract): تناقض بنفس العائلة لنفس التركيب (`Card > Table` برأس `bg-stone-100 border-b-2`).
- التشغيل (Runtime):
  - بلا قص: `pages/Lands/SeasonShow.tsx:175` و`:211` و`:262` — `<Card className="border-stone-200">`
  - بالقاعدة: `components/Lands/Tabs/SeasonsTab.tsx:80` — `<Card className="overflow-hidden border-stone-200">`
  - المالك: `ui/card.tsx` يعطي `rounded-xl`، و`ui/table.tsx` غلافه `relative w-full overflow-auto` بلا قص — القص مسؤولية المستهلك (كما فعل `SeasonsTab`).
- لا اختراع: توكن `overflow-hidden` مستخدم already بنفس العائلة، يُنسخ كما هو.

## التغيير المقترح (3 أسطر متطابقة)
في `pages/Lands/SeasonShow.tsx` عند الأسطر 175 و211 و262:

قبل (×3):
```tsx
<Card className="border-stone-200">
```

بعد (×3):
```tsx
<Card className="overflow-hidden border-stone-200">
```

- فقط البطاقات الثلاث الحاوية للجداول (حصاد/تكاليف/مبيعات). لا تمس بطاقة التسوية (`border-emerald-200`) — بلا جدول مظلل.

## خطوات المنفذ (Executor)
1. افتح `SeasonShow.tsx` — أسطر 175، 211، 262 (كل سطر يسبق `<Table>` مباشرة).
2. أضف `overflow-hidden` أول توكن في `className` (نفس ترتيب `SeasonsTab:80`).
3. احفظ.

## التحقق (Verification)
1. افتح صفحة موسم — زوايا رؤوس الجداول الثلاث مستديرة مع البطاقة، بلا بروز.
2. بطاقة التسوية والتفاعلات (الحوارات/الحذف) لم تتأثر.
3. `npx tsc --noEmit` ينجح. بصري فقط.

## خارج النطاق
- بطاقات `Lands/Index` و`Sales/Index` (نفس البروز المحتمل) — خارج سطح `Lands/Show` المدقق؛ تعمم لاحقاً بنفس القاعدة إن طلبت.
