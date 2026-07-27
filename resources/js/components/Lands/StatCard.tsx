import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}

export default function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <Card className="border-stone-200">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-semibold font-mono leading-none">{value}</p>
          <p className="mt-1 text-sm text-stone-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}