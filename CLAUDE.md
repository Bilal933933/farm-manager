# Farm Manager — سياق المشروع

هذا الملف مرجع دائم لأي عمل يقوم به Claude داخل هذا المشروع. اقرأه قبل إضافة أي كود جديد،
والتزم بالقرارات المذكورة هنا إلا إذا طلب المستخدم صراحة تغييرها.

## فلسفة المشروع

Farm Manager ليس تطبيق CRUD لإدارة الأراضي، بل نظام ERP زراعي مصغر يركز على إدارة النشاط
الزراعي والمحاسبي معًا. جميع القرارات المعمارية يجب أن تفضل قابلية التوسع والمحافظة على سلامة
البيانات، حتى لو زاد ذلك من عدد الملفات أو الطبقات.

## نظرة عامة

نظام إدارة مزرعة داخلي (وليس منتجًا عامًا أو API خارجي) سيستخدمه صاحب المزرعة يوميًا لإدارة:
الأراضي، المواسم الزراعية، العقود، الموردين/المزارعين (الأطراف)، المخزون، المشتريات، والحسابات المالية.

الهدف ليس مجرد CRUD. الشاشة الرئيسية يجب أن تُقرأ كلوحة تحكم ERP حقيقية، تعرض:

- 💰 الرصيد النقدي الحالي
- 📄 الديون المستحقة للموردين
- 🌾 المواسم الزراعية النشطة
- 🚜 الأراضي التي يعمل عليها حاليًا
- ⚠️ الأطراف الذين عليهم سلف/مبالغ لم تُسوَّ
- 📦 أصناف المخزون التي أوشكت على النفاد

## المسار والبيئة

- مسار المشروع محليًا: `E:\heard\farm-manager`
- Laravel Framework 13.x (Laravel 13.22.0 وقت الإنشاء)
- PostgreSQL (تم التحويل إليها من SQLite عمدًا — راجع "قرارات قاعدة البيانات" أدناه)
- Inertia.js v3 + React 19 (وليس Vue)
- shadcn/ui + Tailwind CSS v4
- الواجهة بالكامل RTL وباللغة العربية

### تشغيل المشروع محليًا

```bash
php artisan serve
npm run dev
```
ثم فتح `http://127.0.0.1:8000`.

## مبدأ معماري: LandSeason هو Aggregate Root

```
Land
    ↓
LandSeason  ← محور النظام
    ↓
Expenses
Inventory Usage
Farmer Transactions (سلف/تسوية)
Harvest
```

أي عملية تخص الزراعة (مصروف، محصول، استهلاك مخزون، سلفة مزارع...) يجب أن ترتبط بموسم زراعي
متى كان ذلك منطقيًا. الموسم هو نقطة الارتكاز التي تربط الأراضي ببقية العمليات.

## فلسفة الدفتر المالي (Ledger)

**Ledger ليس واجهة إدخال بيانات.** هو دفتر الأستاذ للنظام.

لا تُنشأ الحركات المالية يدويًا إلا في حالات استثنائية. أي عملية (شراء، سداد، سلفة، بيع، قبض)
هي التي تُنشئ الحركات المالية تلقائيًا. المستخدم يتعامل مع:

- **Purchase** ← يُنشئ قيدًا في Ledger
- **Payment** ← يُنشئ قيدًا في Ledger
- **Advance** ← يُنشئ قيدًا في Ledger
- **Sale** ← يُنشئ قيدًا في Ledger
- **Collection** ← يُنشئ قيدًا في Ledger

## الدومينات ومسؤولياتها

| Domain | المسؤولية |
|---|---|
| Lands | إدارة الأراضي (المساحة، الموقع، الحدود، سند الملكية) |
| Parties | الأشخاص والجهات (موردين، مزارعين، ملاك) |
| PartyRoles | ربط الأطراف بالأدوار (مورد/مزارع/مالك) |
| Products | كتالوج الأصناف — اكتمل |
| StockMovements | حركات المخزون (دخول/خروج) — اكتمل |
| Purchases | فواتير الشراء + تكامل StockMovements — اكتمل |
| Payments | مدفوعات ومقبوضات (دفع/قبض) — اكتمل |
| Ledger | سجل مالي يُولَّد تلقائيًا من Purchases وPayments — اكتمل |
| Balance Services | خدمات حساب الأرصدة — قادم |
| Reports | التقارير — لاحقًا |

**ترتيب البناء:** Lands → Parties → Products → StockMovements → Purchases → Payments → Ledger ← (نحن هنا) → Balance Services

## قرارات قاعدة البيانات (نهائية، لا تُغيَّر بدون نقاش)

| القرار | التفصيل |
|---|---|
| المفاتيح الأساسية | `$table->id()` (BigInt Auto Increment) — **ليس** UUID أو ULID، لأن النظام داخلي وليس API عام |
| الحذف | `SoftDeletes` في كل الجداول المهمة: `Lands`, `Parties`, `Products`, `LandContracts`, `LandSeasons` وما شابه |
| القيم النصية للحالات | الـ Enums تُخزَّن مباشرة بالعربية كقيمة نصية (مثال: `'نشط'`, `'متوقف'`) بدل أكواد إنجليزية، حتى تُعرض في الواجهة بدون أي طبقة ترجمة إضافية |
| التحقق من الـ Enums | استخدام `Rule::enum(EnumClass::class)` في كل FormRequest، وليس `string\|max` عام |
| Fillable | `protected $fillable = [...]` كخاصية عادية. **لا تستخدم** `#[Fillable(...)]` كـ Attribute — هذا غير قياسي في Laravel وسبق أن سبّب التباسًا |
| استخدام Ziggy | `route()` متاح في JavaScript عبر Ziggy (`tightenco/ziggy`). `@routes` مضاف في `app.blade.php` |

## هيكلة المشروع: Domain-Driven، ليس MVC التقليدي

**لا نستخدم** الهيكل التقليدي `app/Models`, `app/Http/Controllers` بشكل مسطّح.
كل مجال عمل (Domain) له مجلده الخاص تحت `app/Domains/{DomainName}/`، ويحتوي (حسب الحاجة):

```
app/Domains/{DomainName}/
├── Actions/        # Use Case واحد لكل Action، execute() كنقطة دخول موحّدة
├── Enums/          # enum: string لكل حالة/نوع—يمنع استخدام Magic Strings
├── Http/Controllers/
├── Models/
├── Policies/        # صلاحيات — لم تُبنَ بعد (راجع "أعمال معلّقة")
├── Requests/         # FormRequest لكل عملية Store/Update
└── Services/         # فقط عند الحاجة—ليس افتراضيًا (راجع القاعدة أدناه)
```

### اصطلاح الـ Actions

- كل Action مسؤول عن **Use Case واحدة فقط**.
- التسمية: `Create{Entity}Action`, `Update{Entity}Action`, `Delete{Entity}Action` — وليس `{Entity}Action`.
- دالة `execute()` هي نقطة الدخول الوحيدة.
- حتى لو كانت اليوم مجرد `Model::create($data)`، أبقِها كما هي — إنها نقطة تمدد مستقبلية
  (إضافة Events، منطق محاسبي، إلخ) وليست طبقة زائدة.

### قاعدة Services

**لا يُنشأ Service إلا عند الحاجة.** المعيار: عندما يكون منطق الأعمال لا يناسب Action واحدة،
أو يحتاج إلى التنسيق بين أكثر من Domain. لا تضع كل شيء داخل Services افتراضيًا.

### Enums: يحظر استخدام Magic Strings

أي قيمة محددة (حالة، نوع، تصنيف) يجب أن تكون `enum`. ممنوع استخدام النصوص المجردة
(Magic Strings) داخل الكود. مثال — **صح**:

```php
LandStatus::نشط->value
```

**خطأ**:

```php
'نشط'
```

## الفرونت اند (React + Inertia + shadcn/ui)

- كل صفحة تحت `resources/js/Pages/{Domain}/` بأسماء قياسية: `Index.tsx`, `Create.tsx`, `Edit.tsx`, `Show.tsx`
- الفورم المشترك بين Create/Edit يوضع في `resources/js/Components/{Domain}/{Domain}Form.tsx` ويستقبل `data/setData/errors/processing/onSubmit` من `useForm` الخاص بـ Inertia
- كل enum له ملف مطابق في `resources/js/lib/{domain}Enums.ts` بنفس القيم النصية العربية الموجودة في enum الباك اند تمامًا (بدون تحويل)
- شارة الحالة (`StatusBadge`) موحّدة لكل الدومينات عبر `Components/Lands/StatusBadge.tsx` + خريطة ألوان `STATUS_TONE` في `lib/landEnums.ts`
- العمليات الفرعية (مثل إضافة عقد/موسم من صفحة تفاصيل الأرض) تُبنى كـ Dialog (shadcn) وليس صفحة منفصلة
- الحذف دائمًا عبر `AlertDialog` للتأكيد، لا حذف مباشر بدون تأكيد

### هوية بصرية مُتفق عليها

- اللون الأساسي: أخضر زيتوني (`emerald`) — يعكس الطابع الزراعي
- الأرقام (مساحات، تكاليف، تواريخ، مبالغ) تُعرض دائمًا بـ `font-mono` لإحساس "سجل محاسبي"
- الواجهة RTL بالكامل (`dir="rtl"` على مستوى الصفحة)

## مبدأ التطوير

أي ميزة جديدة يجب أن تبدأ بتحليل المجال (Domain Analysis) قبل كتابة Migration أو Model.
لا تُكتب الجداول أولًا ثم يُفكر في استخدامها لاحقًا.

## عدم استخدام Repository Pattern افتراضيًا

Laravel Eloquent هو Repository بالفعل. لا يُنشأ Repository إلا عند وجود حاجة حقيقية
(مصدر بيانات متعدد، Query معقدة، أو قابلية استبدال المصدر).

## أعمال معلّقة / قرارات لم تُتخذ بعد

- **الصلاحيات**: كل `authorize()` في الـ FormRequests يُرجع `true` حاليًا — لا توجد Policies فعلية بعد. هذا مقبول مؤقتًا في مرحلة البناء، لكن يجب معالجته قبل أي استخدام فعلي من أكثر من مستخدم.
- **الأدوار**: تم تأجيل الأدوار إلى ما بعد الدومينات الأساسية. حاليًا يُستخدم حقل بسيط إذا لزم الأمر.
- **ترتيب الهجرات**: تأكد عند إضافة جداول جديدة أن أي جدول يحتوي Foreign Key يُنشأ **بعد** الجدول المشار إليه.
- **لوحة التحكم الرئيسية (Dashboard)**: لم تُبنَ بعد. يجب أن تجمع بيانات من كل الدومينات عبر `DashboardService` يستدعي عدة Queries/Repositories، لا استعلامات مباشرة في الـ Controller.
- **إعادة تشغيل Ziggy**: بعد إضافة أي Route جديد، شغّل `php artisan wayfinder:generate`.

## اصطلاحات Git / Commit Messages

- اللغة: **العربية** لوصف التغيير، والإنجليزية للأسماء التقنية (مثال: `دومين الأراضي: إضافة CRUD كامل + Actions + Migrations`)
- الصيغة: `[المجال]: [فعل] + [وصف مختصر]`
- أمثلة:
  - `دومين الأراضي: إضافة نموذج Land مع SoftDeletes والعلاقات`
  - `دومين Parties: إنشاء Controller + Actions + Requests`
  - `إصلاح: تصحيح Fillable Attribute في Models`
  - `Frontend: إضافة صفحات الأراضي Index/Create/Edit/Show`
- لا تُنشئ commits بدون طلب صريح من المستخدم

## عند إضافة دومين جديد

اتبع نفس نمط دومين Lands/Parties تمامًا:
1. Enum لكل حقل له قيم محدودة (قيمته النصية بالعربية مباشرة)
2. Model مع `$fillable` صريح و`SoftDeletes` إن كان الجدول مهمًا
3. Actions منفصلة (Create/Update/Delete) بدالة `execute()`
4. FormRequest لكل عملية مع `Rule::enum()` لأي حقل enum
5. Controller يستدعي الـ Actions فقط، لا منطق أعمال مباشر فيه
6. صفحات Inertia (Index/Create/Edit/Show) + فورم مشترك + ملف enums JS مطابق
7. Routes تُضاف لملف routes منفصل أو تُدمج حسب تنظيم `routes/web.php` الحالي
8. شغّل `php artisan wayfinder:generate` بعد إضافة Routes جديدة
9. شغّل `php vendor/bin/pint --test app/Domains/{DomainName}` للتأكد من سلامة الكود
