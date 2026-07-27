<?php

namespace Database\Seeders;

use App\Domains\Parties\Enums\PartyType;
use App\Domains\Parties\Models\Party;
use Illuminate\Database\Seeder;

class PartiesSeeder extends Seeder
{
    public function run(): void
    {
        Party::create([
            'name' => 'مؤسسة الريان للأسمدة',
            'type' => PartyType::Company->value,
            'phone' => '01001234567',
            'address' => 'المنصورة - شارع الجمهورية',
            'notes' => 'مورد أسمدة رئيسي',
        ]);

        Party::create([
            'name' => 'شركة النور للمبيدات',
            'type' => PartyType::Company->value,
            'phone' => '01009876543',
            'address' => 'طنطا - شارع البحر',
            'notes' => 'مورد مبيدات',
        ]);

        Party::create([
            'name' => 'تاجر الخضار أحمد علي',
            'type' => PartyType::Individual->value,
            'phone' => '01201112233',
            'address' => 'كفر الشيخ - سوق الخضار',
            'notes' => 'عميل دائم لبيع المحاصيل',
        ]);

        Party::create([
            'name' => 'سوق الجملة بكفر الشيخ',
            'type' => PartyType::Company->value,
            'phone' => '0473221456',
            'address' => 'كفر الشيخ - المنطقة الصناعية',
            'notes' => 'سوق جملة لبيع المنتجات الزراعية',
        ]);
    }
}
