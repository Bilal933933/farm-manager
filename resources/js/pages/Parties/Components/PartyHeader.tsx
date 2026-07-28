import { Link } from '@inertiajs/react';
import { ArrowRight, Pencil, Phone, MapPin, Notebook } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Party } from './types';

interface Props {
  party: Party;
}

export default function PartyHeader({ party }: Props) {
  const contactItems = [
    { key: 'phone', icon: Phone, label: null, value: party.phone, dir: 'ltr' as const, mono: true },
    { key: 'email', icon: null, label: null, value: party.email, dir: 'ltr' as const, mono: true },
    { key: 'national_id', icon: null, label: 'الرقم القومي:', value: party.national_id, dir: null, mono: true },
    { key: 'address', icon: MapPin, label: null, value: party.address, dir: null, mono: false },
  ].filter((item) => item.value);

  return (
    <Card className="border-stone-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-stone-900">{party.name}</h1>
              <Badge variant="secondary" className="rounded-full text-xs font-normal px-3 py-0.5">
                {party.type === 'فرد' ? 'فرد' : 'شركة'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {contactItems.map((item) => (
                <div key={item.key} className="flex items-center gap-2 text-stone-600">
                  {item.icon && <item.icon className="h-4 w-4 text-stone-400 shrink-0" />}
                  {item.label && <span className="text-stone-400 shrink-0">{item.label}</span>}
                  <span
                    className={[
                      item.mono ? 'font-mono' : '',
                      item.key === 'phone' ? 'font-medium text-stone-800' : 'text-stone-500',
                    ].join(' ')}
                    {...(item.dir ? { dir: item.dir } : {})}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {party.notes && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50/70 border border-amber-200/50 p-3 text-sm text-amber-800">
                <Notebook className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{party.notes}</span>
              </div>
            )}
          </div>

          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link href={route('parties.edit', party.id)}>
              <Pencil className="ms-2 h-4 w-4" />
              تعديل
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
