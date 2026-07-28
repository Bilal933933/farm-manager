<?php

namespace Database\Seeders;

use App\Domains\Parties\Enums\PartyCategory;
use App\Domains\Parties\Enums\PartyType;
use App\Domains\Parties\Models\Party;
use Illuminate\Database\Seeder;

class PartiesSeeder extends Seeder
{
    public function run(): void
    {
        // Suppliers
        Party::create([
            'name' => 'مؤسسة الريان للأسمدة',
            'type' => PartyType::Company->value,
            'category' => PartyCategory::Supplier->value,
            'phone' => '01001234567',
            'address' => 'المنصورة - شارع الجمهورية',
            'notes' => 'مورد أسمدة رئيسي',
        ]);

        Party::create([
            'name' => 'شركة النور للمبيدات',
            'type' => PartyType::Company->value,
            'category' => PartyCategory::Supplier->value,
            'phone' => '01009876543',
            'address' => 'طنطا - شارع البحر',
            'notes' => 'مورد مبيدات',
        ]);

        // Buyers
        Party::create([
            'name' => 'تاجر الخضار أحمد علي',
            'type' => PartyType::Individual->value,
            'category' => PartyCategory::Merchant->value,
            'phone' => '01201112233',
            'address' => 'كفر الشيخ - سوق الخضار',
            'notes' => 'عميل دائم لبيع المحاصيل',
        ]);

        Party::create([
            'name' => 'سوق الجملة بكفر الشيخ',
            'type' => PartyType::Company->value,
            'category' => PartyCategory::Merchant->value,
            'phone' => '0473221456',
            'address' => 'كفر الشيخ - المنطقة الصناعية',
            'notes' => 'سوق جملة لبيع المنتجات الزراعية',
        ]);

        // Land owners
        Party::create([
            'name' => 'السيد محمد جابر',
            'type' => PartyType::Individual->value,
            'category' => PartyCategory::Lessor->value,
            'phone' => '01005554433',
            'address' => 'كفر الشيخ - مركز بيلا',
            'notes' => 'مالك أرض السلام وأرض الترعة',
        ]);

        Party::create([
            'name' => 'شركة التنمية الزراعية',
            'type' => PartyType::Company->value,
            'category' => PartyCategory::Lessor->value,
            'phone' => '01007778899',
            'address' => 'القاهرة - مدينة نصر',
            'notes' => 'شركة استثمار زراعي - مالكة أرض النيل ومزرعة الوادي وحقل الأمل',
        ]);
    }
}
