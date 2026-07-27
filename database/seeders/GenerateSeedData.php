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
// 2. Seasons (5 لكل أرض: 2022صيفي, 2022شتوي, 2023صيفي, 2023شتوي, 2024صيفي)
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
// 3. Contracts (2 لكل أرض)
// ──────────────────────────────────────────────
$contractParties = ['مؤسسة الريان للأسمدة', 'سوق الجملة بكفر الشيخ'];
$contracts = [];
foreach ($lands as $li => $land) {
    $startYear = 2022 + $li;
    $contracts[] = [
        'land_ref' => $land['ref'],
        'party_name' => $contractParties[0],
        'type' => 'إيجار',
        'start_date' => "$startYear-01-01",
        'end_date' => ($startYear + 2).'-12-31',
        'amount' => round(5000 * $land['area'] * (0.9 + mt_rand(0, 20) / 100), -2),
        'notes' => 'عقد إيجار أرض '.$land['name'],
    ];
    $contracts[] = [
        'land_ref' => $land['ref'],
        'party_name' => $contractParties[1],
        'type' => 'إيجار',
        'start_date' => ($startYear + 1).'-06-01',
        'end_date' => ($startYear + 3).'-05-31',
        'amount' => round(4000 * $land['area'] * (0.9 + mt_rand(0, 20) / 100), -2),
        'notes' => 'عقد إيجار تكميلي',
    ];
}

// ──────────────────────────────────────────────
// 4. Costs (25 لكل موسم × 25 موسم = 625)
// ──────────────────────────────────────────────
$costTemplates = [
    ['type' => 'بذور',     'desc' => 'بذور المحصول',                                    'min' => 8000,  'max' => 25000],
    ['type' => 'أسمدة',     'desc' => 'سماد يوريا 46% - %d شيكارة',                       'min' => 10000, 'max' => 25000],
    ['type' => 'أسمدة',     'desc' => 'سماد نترات النشادر - %d شيكارة',                    'min' => 8000,  'max' => 20000],
    ['type' => 'أسمدة',     'desc' => 'سماد سوبر فوسفات - %d شيكارة',                     'min' => 6000,  'max' => 15000],
    ['type' => 'أسمدة',     'desc' => 'سماد مركب NPK - %d شيكارة',                        'min' => 10000, 'max' => 22000],
    ['type' => 'مبيدات',    'desc' => 'مبيد حشائش - %d لتر',                               'min' => 3000,  'max' => 10000],
    ['type' => 'مبيدات',    'desc' => 'مبيد فطريات - %d كجم',                              'min' => 4000,  'max' => 12000],
    ['type' => 'مبيدات',    'desc' => 'مبيد حشرات - %d لتر',                               'min' => 5000,  'max' => 15000],
    ['type' => 'عمالة',     'desc' => 'عمالة تجهيز الأرض للزراعة',                          'min' => 2000,  'max' => 5000],
    ['type' => 'عمالة',     'desc' => 'عمالة زراعة - %d يوم',                              'min' => 3000,  'max' => 6000],
    ['type' => 'عمالة',     'desc' => 'عمالة تسميد - %d يوم',                              'min' => 1500,  'max' => 4000],
    ['type' => 'عمالة',     'desc' => 'عمالة حصاد - %d يوم',                               'min' => 4000,  'max' => 10000],
    ['type' => 'عمالة',     'desc' => 'عمالة رش مبيدات - %d يوم',                          'min' => 2000,  'max' => 5000],
    ['type' => 'ري',        'desc' => 'فواتير مياه الري - شهر %d',                         'min' => 1500,  'max' => 4000],
    ['type' => 'ري',        'desc' => 'صيانة شبكة الري',                                   'min' => 2000,  'max' => 8000],
    ['type' => 'ري',        'desc' => 'وقود مضخات الري - %d لتر',                          'min' => 3000,  'max' => 7000],
    ['type' => 'نقل',       'desc' => 'نقل المحصول إلى السوق',                             'min' => 2000,  'max' => 6000],
    ['type' => 'نقل',       'desc' => 'نقل مستلزمات الإنتاج',                              'min' => 1000,  'max' => 3000],
    ['type' => 'خدمات',     'desc' => 'كهرباء',                                            'min' => 500,   'max' => 2000],
    ['type' => 'خدمات',     'desc' => 'هاتف وإنترنت',                                      'min' => 300,   'max' => 1000],
    ['type' => 'صيانة',     'desc' => 'صيانة جرار زراعي',                                  'min' => 3000,  'max' => 10000],
    ['type' => 'صيانة',     'desc' => 'صيانة مواتير الري',                                 'min' => 2000,  'max' => 8000],
    ['type' => 'أخرى',      'desc' => 'مصاريف إدارية',                                     'min' => 500,   'max' => 2000],
    ['type' => 'أخرى',      'desc' => 'تأمين على المحصول',                                 'min' => 2000,  'max' => 5000],
    ['type' => 'حصاد',      'desc' => 'آلات حصاد - تأجير',                                 'min' => 5000,  'max' => 12000],
];

$costs = [];
$cropNames = ['بطيخ أحمر', 'قمح صلب'];
foreach ($seasons as $si => $season) {
    $plantTs = strtotime($season['planting_date']);
    $harvestTs = strtotime($season['harvest_date']);
    $seasonDays = max(1, ($harvestTs - $plantTs) / 86400);

    foreach ($costTemplates as $cti => $tmpl) {
        $dayOffset = (int) round($seasonDays * ($cti + 1) / (count($costTemplates) + 1));
        $dateTs = $plantTs + $dayOffset * 86400;
        $dateTs = min($dateTs, $harvestTs);

        $qty = mt_rand(2, 100);
        $amount = round(mt_rand($tmpl['min'], $tmpl['max']) * (0.8 + mt_rand(0, 40) / 100), 2);

        if (str_contains($tmpl['desc'], '%d')) {
            $desc = sprintf($tmpl['desc'], $qty);
        } else {
            $desc = $tmpl['desc'];
        }

        // ربط التكلفة بنصف الإيجار السنوي لكل موسم
        if ($tmpl['type'] === 'إيجار') {
            continue; // سنضيف الإيجار لاحقاً
        }

        $costs[] = [
            'season_ref' => $season['ref'],
            'type' => $tmpl['type'],
            'description' => $desc,
            'amount' => $amount,
            'date' => date('Y-m-d', $dateTs),
        ];
    }
}

// ──────────────────────────────────────────────
// 5. إضافة تكاليف الإيجار (نصف الإيجار السنوي لكل موسم)
// ──────────────────────────────────────────────
$annualRentByLand = [];
foreach ($lands as $land) {
    $annualRentByLand[$land['ref']] = round(8000 * $land['area'] * (0.9 + mt_rand(0, 20) / 100), -2);
}
foreach ($seasons as $season) {
    $annualRent = $annualRentByLand[$season['land_ref']] ?? 0;
    $rentShare = round($annualRent / 2, 2); // نصف الإيجار السنوي لكل موسم
    $costs[] = [
        'season_ref' => $season['ref'],
        'type' => 'إيجار',
        'description' => 'نصيب الموسم من الإيجار السنوي للأرض',
        'amount' => $rentShare,
        'date' => $season['planting_date'],
    ];
}

// ──────────────────────────────────────────────
// 6. Harvests (1-2 لكل موسم × 25 = ~35)
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
// 7. Sales (5 لكل حصاد × ~35 = ~175)
// ──────────────────────────────────────────────
$parties = [
    'سوق الجملة بكفر الشيخ',
    'تاجر الخضار أحمد علي',
];
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
            'party_name' => $parties[mt_rand(0, count($parties) - 1)],
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
    'seasons.json' => $seasons,
    'contracts.json' => $contracts,
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

echo "\n✅ Done — generated ".(count($lands) + count($seasons) + count($contracts) + count($costs) + count($harvests) + count($sales)).' total records in '.count($files)." files.\n";
