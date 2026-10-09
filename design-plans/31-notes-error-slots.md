# خطة 31 — خانات أخطاء الملاحظات التسع (امتداد الخطة 30)

- الحالة: منفذة (Done — 9 خانات، كل 17 `Textarea` بخانة الآن، `tsc --noEmit` ناجح)
- الكوميت المرجعي: `2c88a12cd42159cc62f0420e5fa134166c7fd654`
- السطح: حقول الملاحظات في 9 نماذج (الخطة 30 غطت الأرض/الموسم)
- الأولوية: 1 (خطأ خادم غير مرئي — نفس العلة)

## المشكلة
9 حقول ملاحظات بلا خانة خطأ — رسالة الخادم لا تظهر، بينما حقول الملاحظات في (`CropForm`, `ProductForm`, `LandForm`, `PartyForm`, `PaymentForm`, `PurchaseForm`) تعرضها.

## الدليل
- العقد: تناقض داخل نفس العائلة (6 خانات موجودة مقابل 9 مفقودة)، والنمط `text-sm text-rose-600` موحد.
- التشغيل (كلها `Textarea` بلا `{errors.notes}` بعدها):
  - `HarvestFormDialog:105` — `SaleForm:227` — `SaleFormDialog:188`
  - `ConsumeStockForm:128-133` — `NaqootForm:101-107` — `CostForm:145-150`
  - `ContractFormDialog:232` — `SeasonFormDialog:239` — (`StockMovements:264` سليم — مستثنى)

## التغيير (سطر واحد بعد كل `Textarea` ملاحظات)
```tsx
{errors.notes && <p className="text-sm text-rose-600">{errors.notes}</p>}
```
بنفس مسافة الحقل المجاور. آمن: يُرسم فقط عند وجود خطأ.

## التحقق
1. بحث `Textarea` بلا `{errors.notes}` تالٍ: صفر (عدا المستثنى).
2. `npx tsc --noEmit` ناجح.

## خارج النطاق
- ربط `aria-*` للأخطاء — يستحق تمريرة مستقلة بقراءة كاملة (مؤجل بوعي).
