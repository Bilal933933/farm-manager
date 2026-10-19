import { Link } from '@inertiajs/react';
import { CircleDollarSign, Map, ShoppingCart, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
    { label: 'إضافة أرض', href: () => route('lands.create'), icon: Map },
    { label: 'تسجيل تكلفة', href: () => route('costs.create'), icon: CircleDollarSign },
    { label: 'تسجيل بيع', href: () => route('sales.create'), icon: Sprout },
    { label: 'تسجيل شراء', href: () => route('purchases.create'), icon: ShoppingCart },
];

export default function QuickActions() {
    return (
        <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
                <Button key={action.label} variant="outline" asChild className="border-stone-200">
                    <Link href={action.href()}>
                        <action.icon />
                        {action.label}
                    </Link>
                </Button>
            ))}
        </div>
    );
}
