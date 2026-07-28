<?php

/**
 * توليد ملفات JSON لبيانات السيدر
 * يشغّل: php database/seeders/GenerateSeedData.php
 */
$dataDir = __DIR__.'/data';

// ──────────────────────────────────────────────
// 1. Lands
// ──────────────────────────────────────────────
$lands = [
    ['ref' => 'land_salam',    'name' => 'أرض السلام',    'location' => 'كفر الشيخ - مركز بيلا - ناحية السلام',              'area' => 12, 'area_unit' => 'دونم', 'status' => 'نشط', 'notes' => 'أرض خصبة مجهزة بالري المحوري'],
    ['ref' => 'land_tar3a',    'name' => 'أرض الترعة',    'location' => 'كفر الشيخ - مركز الرياض - بجوار ترعة النوبارية',    'area' => 8,  'area_unit' => 'دونم', 'status' => 'نشط', 'notes' => 'أرض حديثة الري بالغمر'],
    ['ref' => 'land_nile',     'name' => 'أرض النيل',     'location' => 'الأقصر - الضفة الغربية - نجع الأمل',               'area' => 15, 'area_unit' => 'دونم', 'status' => 'نشط', 'notes' => 'أرض رسوبية على ضفاف النيل'],
    ['ref' => 'land_wadi',     'name' => 'مزرعة الوادي',  'location' => 'الوادي الجديد - مركز الخارجة - منطقة الأربعين',    'area' => 25, 'area_unit' => 'دونم', 'status' => 'نشط', 'notes' => 'مزرعة بالصحراء الغربية - ري محوري'],
    ['ref' => 'land_amal',     'name' => 'حقل الأمل',     'location' => 'الشرقية - مركز الزقازيق - ناحية الأمل',            'area' => 10, 'area_unit' => 'دونم', 'status' => 'نشط', 'notes' => 'أرض طينية جيدة الصرف'],
];

// ──────────────────────────────────────────────
// 2. Parties
// ──────────────────────────────────────────────
$parties = [
    ['ref' => 'party_reyyan',       'name' => 'مؤسسة الريان للأسمدة',       'type' => 'شركة', 'category' => 'متجر مستلزمات زراعية', 'phone' => '01001234567', 'address' => 'المنصورة - شارع الجمهورية',         'notes' => 'مورد أسمدة رئيسي'],
    ['ref' => 'party_nour',         'name' => 'شركة النور للمبيدات',        'type' => 'شركة', 'category' => 'متجر مستلزمات زراعية', 'phone' => '01009876543', 'address' => 'طنطا - شارع البحر',                'notes' => 'مورد مبيدات'],
    ['ref' => 'party_trader',       'name' => 'تاجر الخضار أحمد علي',      'type' => 'فرد',  'category' => 'تاجر',              'phone' => '01201112233', 'address' => 'كفر الشيخ - سوق الخضار',            'notes' => 'عميل دائم لبيع المحاصيل'],
    ['ref' => 'party_wholesale',    'name' => 'سوق الجملة بكفر الشيخ',     'type' => 'شركة', 'category' => 'تاجر',              'phone' => '0473221456',  'address' => 'كفر الشيخ - المنطقة الصناعية',      'notes' => 'سوق جملة لبيع المنتجات الزراعية'],
    ['ref' => 'party_owner1',       'name' => 'السيد محمد جابر',           'type' => 'فرد',  'category' => 'مؤجر',              'phone' => '01005554433', 'address' => 'كفر الشيخ - مركز بيلا',             'notes' => 'مالك أرض السلام وأرض الترعة'],
    ['ref' => 'party_owner2',       'name' => 'شركة التنمية الزراعية',     'type' => 'شركة', 'category' => 'مؤجر',              'phone' => '01007778899', 'address' => 'القاهرة - مدينة نصر',               'notes' => 'شركة استثمار زراعي - مالكة أرض النيل ومزرعة الوادي'],
    ['ref' => 'party_farmer1',      'name' => 'الحاج محمود عبدالله',       'type' => 'فرد',  'category' => 'مزارع',             'phone' => '01001112233', 'address' => 'كفر الشيخ - مركز بيلا - ناحية السلام',   'notes' => 'مزارع رئيسي'],
];

// ──────────────────────────────────────────────
// 3. Seasons (5 لكل أرض: 2022صيفي, 2022شتوي, 2023صيفي, 2023شتوي, 2024صيفي)
// ──────────────────────────────────────────────
$seasonDefs = [
    ['year' => 2022, 'period' => 'صيفي', 'crop' => 'بطيخ أحمر', 'plant_m' => 3,  'plant_d' => 1,  'harvest_m' => 6,  'harvest_d' => 15, 'expected_cost' => 150000],
    ['year' => 2022, 'period' => 'شتوي', 'crop' => 'قمح صلب',   'plant_m' => 11, 'plant_d' => 1,  'harvest_m' => 4,  'harvest_d' => 15, 'expected_cost' => 120000],
    ['year' => 2023, 'period' => 'صيفي', 'crop' => 'بطيخ أحمر', 'plant_m' => 3,  'plant_d' => 5,  'harvest_m' => 6,  'harvest_d' => 20, 'expected_cost' => 160000],
    ['year' => 2023, 'period' => 'شتوي', 'crop' => 'قمح صلب',   'plant_m' => 11, 'plant_d' => 5,  'harvest_m' => 4,  'harvest_d' => 20, 'expected_cost' => 130000],
    ['year' => 2024, 'period' => 'صيفي', 'crop' => 'بطيخ أحمر', 'plant_m' => 3,  'plant_d' => 10, 'harvest_m' => 6,  'harvest_d' => 25, 'expected_cost' => 180000],
];

$seasons = [];
$seasonIndex = 0;
foreach ($lands as $li => $land) {
    foreach ($seasonDefs as $sd) {
        $seasonIndex++;
        $ref = $land['ref'].'_'.$sd['year'].'_'.$sd['period'];
        $seasons[] = [
            'ref' => $ref,
            'land_ref' => $land['ref'],
            'year' => $sd['year'],
            'period' => $sd['period'],
            'crop' => $sd['crop'],
            'cultivated_area' => round($land['area'] * (0.7 + mt_rand(0, 25) / 100), 2),
            'planting_date' => sprintf('%d-%02d-%02d', $sd['year'], $sd['plant_m'], $sd['plant_d']),
            'harvest_date' => sprintf('%d-%02d-%02d', $sd['year'] + ($sd['harvest_m'] < 6 ? 1 : 0), $sd['harvest_m'], $sd['harvest_d']),
            'expected_cost' => $sd['expected_cost'] * (0.8 + mt_rand(0, 40) / 100),
            'status' => $sd['year'] >= 2024 ? 'نشط' : 'منتهي',
            'order' => $seasonIndex,
        ];
    }
}

// ──────────────────────────────────────────────
// 4. Contracts — now linked to land-owner parties
// ──────────────────────────────────────────────
$contracts = [
    // أرض السلام → مؤجر from السيد محمد جابر
    [
        'ref' => 'ctr_salam',
        'land_ref' => 'land_salam',
        'party_ref' => 'party_owner1',
        'type' => 'مؤجر',
        'start_date' => '2024-01-01',
        'end_date' => '2026-12-31',
        'amount' => 186000,
        'notes' => 'عقد تأجير أرض السلام - 5,166 جنيه للدونم سنوياً',
    ],
    // أرض الترعة → مؤجر from السيد محمد جابر
    [
        'ref' => 'ctr_tar3a',
        'land_ref' => 'land_tar3a',
        'party_ref' => 'party_owner1',
        'type' => 'مؤجر',
        'start_date' => '2024-01-01',
        'end_date' => '2026-12-31',
        'amount' => 120000,
        'notes' => 'عقد تأجير أرض الترعة - 5,000 جنيه للدونم سنوياً',
    ],
    // أرض النيل → مؤجر from شركة التنمية الزراعية
    [
        'ref' => 'ctr_nile',
        'land_ref' => 'land_nile',
        'party_ref' => 'party_owner2',
        'type' => 'مؤجر',
        'start_date' => '2024-01-01',
        'end_date' => '2026-12-31',
        'amount' => 225000,
        'notes' => 'عقد تأجير أرض النيل - 5,000 جنيه للدونم سنوياً',
    ],
    // مزرعة الوادي → مؤجر from شركة التنمية الزراعية
    [
        'ref' => 'ctr_wadi',
        'land_ref' => 'land_wadi',
        'party_ref' => 'party_owner2',
        'type' => 'مؤجر',
        'start_date' => '2024-01-01',
        'end_date' => '2026-12-31',
        'amount' => 350000,
        'notes' => 'عقد تأجير مزرعة الوادي - 4,667 جنيه للدونم سنوياً',
    ],
    // حقل الأمل → مؤجر from شركة التنمية الزراعية
    [
        'ref' => 'ctr_amal',
        'land_ref' => 'land_amal',
        'party_ref' => 'party_owner2',
        'type' => 'مؤجر',
        'start_date' => '2024-01-01',
        'end_date' => '2028-12-31',
        'amount' => 800000,
        'notes' => 'عقد تأجير حقل الأمل - 80,000 جنيه سنوياً',
    ],
    // مزرعة الوادي → مزارع with الحاج محمود عبدالله
    [
        'ref' => 'ctr_farmer_wadi',
        'land_ref' => 'land_wadi',
        'party_ref' => 'party_farmer1',
        'type' => 'مزارع',
        'settlement_type' => 'نسبة',
        'share_percentage' => 25,
        'start_date' => '2024-01-01',
        'end_date' => null,
        'amount' => 0,
        'notes' => 'عقد مزارعة مع الحاج محمود عبدالله - 25% من الإنتاج',
    ],
];

// ──────────────────────────────────────────────
// 5. Payments linked to contracts
// ──────────────────────────────────────────────
$payments = [
    // Payments to السيد محمد جابر for أرض السلام lease (186,000 total — 100,000 paid so far, 86,000 remaining)
    ['party_ref' => 'party_owner1', 'contract_ref' => 'ctr_salam', 'type' => 'دفع', 'date' => '2024-01-15', 'amount' => 50000, 'notes' => 'دفعة إيجار أرض السلام - مقدمة العقد'],
    ['party_ref' => 'party_owner1', 'contract_ref' => 'ctr_salam', 'type' => 'دفع', 'date' => '2024-07-01', 'amount' => 25000, 'notes' => 'دفعة إيجار أرض السلام - الدفعة الثانية'],
    ['party_ref' => 'party_owner1', 'contract_ref' => 'ctr_salam', 'type' => 'دفع', 'date' => '2025-01-10', 'amount' => 25000, 'notes' => 'دفعة إيجار أرض السلام - السنة الثانية'],

    // Payments to السيد محمد جابر for أرض الترعة lease (120,000 — fully paid)
    ['party_ref' => 'party_owner1', 'contract_ref' => 'ctr_tar3a', 'type' => 'دفع', 'date' => '2024-01-20', 'amount' => 120000, 'notes' => 'دفعة إيجار أرض الترعة - كامل المبلغ'],

    // Payments to شركة التنمية الزراعية for أرض النيل lease (225,000 — 80,000 paid, 145,000 remaining)
    ['party_ref' => 'party_owner2', 'contract_ref' => 'ctr_nile', 'type' => 'دفع', 'date' => '2024-02-01', 'amount' => 80000, 'notes' => 'دفعة إيجار أرض النيل - مقدمة'],

    // Payment to شركة التنمية الزراعية for حقل الأمل lease (800,000 — 150,000 paid, 650,000 remaining)
    ['party_ref' => 'party_owner2', 'contract_ref' => 'ctr_amal', 'type' => 'دفع', 'date' => '2024-03-01', 'amount' => 150000, 'notes' => 'دفعة تأجير حقل الأمل - القسط الأول'],

    // Receipt from سوق الجملة (sale payment — no contract)
    ['party_ref' => 'party_wholesale', 'contract_ref' => null, 'type' => 'قبض', 'date' => '2024-06-30', 'amount' => 200000, 'notes' => 'مقبوضات من سوق الجملة - بيع محصول البطيخ'],
];

// ──────────────────────────────────────────────
// 6. Costs (25 لكل موسم × 25 موسم = 625)
// ──────────────────────────────────────────────
$costTemplates = [
    ['type' => 'بذور',     'desc' => 'بذور المحصول',                              'min' => 8000,  'max' => 25000, 'product' => 'بذور بطيخ أحمر'],
    ['type' => 'أسمدة',     'desc' => 'سماد يوريا 46%% - %d شيكارة',              'min' => 10000, 'max' => 25000, 'product' => 'يوريا 46%'],
    ['type' => 'أسمدة',     'desc' => 'سماد نترات النشادر - %d شيكارة',           'min' => 8000,  'max' => 20000, 'product' => 'نترات النشادر'],
    ['type' => 'أسمدة',     'desc' => 'سماد سوبر فوسفات - %d شيكارة',             'min' => 6000,  'max' => 15000, 'product' => null],
    ['type' => 'أسمدة',     'desc' => 'سماد مركب NPK - %d شيكارة',                'min' => 10000, 'max' => 22000, 'product' => 'سماد مركب 19-19-19'],
    ['type' => 'مبيدات',    'desc' => 'مبيد حشائش - %d لتر',                      'min' => 3000,  'max' => 10000, 'product' => null],
    ['type' => 'مبيدات',    'desc' => 'مبيد فطريات - %d كجم',                     'min' => 4000,  'max' => 12000, 'product' => null],
    ['type' => 'مبيدات',    'desc' => 'مبيد حشرات - %d لتر',                      'min' => 5000,  'max' => 15000, 'product' => null],
    ['type' => 'عمالة',     'desc' => 'عمالة تجهيز الأرض للزراعة',                 'min' => 2000,  'max' => 5000,  'product' => null],
    ['type' => 'عمالة',     'desc' => 'عمالة زراعة - %d يوم',                     'min' => 3000,  'max' => 6000,  'product' => null],
    ['type' => 'عمالة',     'desc' => 'عمالة تسميد - %d يوم',                     'min' => 1500,  'max' => 4000,  'product' => null],
    ['type' => 'عمالة',     'desc' => 'عمالة حصاد - %d يوم',                      'min' => 4000,  'max' => 10000, 'product' => null],
    ['type' => 'عمالة',     'desc' => 'عمالة رش مبيدات - %d يوم',                 'min' => 2000,  'max' => 5000,  'product' => null],
    ['type' => 'ري',        'desc' => 'فواتير مياه الري - شهر %d',                'min' => 1500,  'max' => 4000,  'product' => null],
    ['type' => 'ري',        'desc' => 'صيانة شبكة الري',                          'min' => 2000,  'max' => 8000,  'product' => 'خرطوم ري بالتنقيط'],
    ['type' => 'ري',        'desc' => 'وقود مضخات الري - %d لتر',                 'min' => 3000,  'max' => 7000,  'product' => null],
    ['type' => 'نقل',       'desc' => 'نقل المحصول إلى السوق',                    'min' => 2000,  'max' => 6000,  'product' => null],
    ['type' => 'نقل',       'desc' => 'نقل مستلزمات الإنتاج',                     'min' => 1000,  'max' => 3000,  'product' => null],
    ['type' => 'خدمات',     'desc' => 'كهرباء',                                   'min' => 500,   'max' => 2000,  'product' => null],
    ['type' => 'خدمات',     'desc' => 'هاتف وإنترنت',                             'min' => 300,   'max' => 1000,  'product' => null],
    ['type' => 'صيانة',     'desc' => 'صيانة جرار زراعي',                         'min' => 3000,  'max' => 10000, 'product' => null],
    ['type' => 'صيانة',     'desc' => 'صيانة مواتير الري',                        'min' => 2000,  'max' => 8000,  'product' => null],
    ['type' => 'أخرى',      'desc' => 'مصاريف إدارية',                            'min' => 500,   'max' => 2000,  'product' => null],
    ['type' => 'أخرى',      'desc' => 'تأمين على المحصول',                        'min' => 2000,  'max' => 5000,  'product' => null],
    ['type' => 'حصاد',      'desc' => 'آلات حصاد - تأجير',                        'min' => 5000,  'max' => 12000, 'product' => null],
];

$costs = [];
foreach ($seasons as $si => $season) {
    $plantTs = strtotime($season['planting_date']);
    $harvestTs = strtotime($season['harvest_date']);
    $seasonDays = max(1, ($harvestTs - $plantTs) / 86400);

    foreach ($costTemplates as $cti => $tmpl) {
        $dayOffset = (int) round($seasonDays * ($cti + 1) / (count($costTemplates) + 1));
        $dateTs = $plantTs + $dayOffset * 86400;
        $dateTs = min($dateTs, $harvestTs);

        $qty = null;
        $amount = round(mt_rand($tmpl['min'], $tmpl['max']) * (0.8 + mt_rand(0, 40) / 100), 2);

        if (str_contains($tmpl['desc'], '%d')) {
            $qty = mt_rand(2, 100);
            $desc = sprintf($tmpl['desc'], $qty);
        } else {
            $desc = $tmpl['desc'];
        }

        $costs[] = [
            'season_ref' => $season['ref'],
            'type' => $tmpl['type'],
            'description' => $desc,
            'amount' => $amount,
            'qty' => $qty,
            'product_ref' => $tmpl['product'],
            'crop_ref' => $season['crop'],
            'date' => date('Y-m-d', $dateTs),
        ];
    }
}

// ──────────────────────────────────────────────
// 7. Harvests (1-2 لكل موسم)
// ──────────────────────────────────────────────
$harvests = [];
foreach ($seasons as $si => $season) {
    $numHarvests = $season['period'] === 'صيفي' ? 2 : 1;
    for ($h = 1; $h <= $numHarvests; $h++) {
        $harvestDate = date('Y-m-d', strtotime($season['harvest_date']) + $h * 10 * 86400);
        $harvests[] = [
            'ref' => $season['ref'].'_h'.$h,
            'season_ref' => $season['ref'],
            'name' => 'حصاد '.$season['crop'].' - '.$season['period'].' '.$season['year'].($numHarvests > 1 ? (' - الدورة '.$h) : ''),
            'date' => $harvestDate,
            'quantity' => round(mt_rand(150, 350) * $season['cultivated_area'] / 10, 2),
        ];
    }
}

// ──────────────────────────────────────────────
// 8. Sales (5 per harvest)
// ──────────────────────────────────────────────
$buyerParties = ['party_wholesale', 'party_trader'];
$paymentTypes = ['نقدي', 'آجل'];
$sales = [];
foreach ($harvests as $hi => $harvest) {
    $remainingQty = $harvest['quantity'];
    for ($s = 1; $s <= 5; $s++) {
        if ($s < 5) {
            $qty = round($remainingQty * mt_rand(10, 35) / 100, 2);
        } else {
            $qty = round($remainingQty, 2);
        }
        $remainingQty -= $qty;
        if ($qty <= 0) {
            break;
        }

        $sales[] = [
            'harvest_ref' => $harvest['ref'],
            'party_ref' => $buyerParties[mt_rand(0, count($buyerParties) - 1)],
            'quantity' => $qty,
            'unit_price' => mt_rand(3500, 5200),
            'date' => date('Y-m-d', strtotime($harvest['date']) + $s * mt_rand(2, 7) * 86400),
            'payment_type' => $paymentTypes[mt_rand(0, 1)],
        ];
    }
}

// ──────────────────────────────────────────────
// Write JSON files
// ──────────────────────────────────────────────
$files = [
    'lands.json' => $lands,
    'parties.json' => $parties,
    'seasons.json' => $seasons,
    'contracts.json' => $contracts,
    'payments.json' => $payments,
    'costs.json' => $costs,
    'harvests.json' => $harvests,
    'sales.json' => $sales,
];

foreach ($files as $filename => $data) {
    $path = $dataDir.'/'.$filename;
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    file_put_contents($path, $json);
    echo "✓ $filename — ".count($data)." records\n";
}

echo "\n✅ Done — generated ".(count($lands) + count($parties) + count($seasons) + count($contracts) + count($payments) + count($costs) + count($harvests) + count($sales)).' total records in '.count($files)." files.\n";
