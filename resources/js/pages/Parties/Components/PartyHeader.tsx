import { Link } from '@inertiajs/react';
import { Pencil, Phone, MapPin, Notebook, Building2, User, Home, Sprout, Store, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import StatusBadge from '@/components/Lands/StatusBadge';
import { PARTY_CATEGORY_TONE, PARTY_CATEGORY_AVATAR } from '@/lib/partyEnums';
import type { Party } from './types';

const CATEGORY_ICONS: Record<string, typeof Home> = {
  مؤجر: Home,
  مستأجر: User,
  مزارع: Sprout,
  'متجر مستلزمات زراعية': Store,
  تاجر: Truck,
};

interface Props {
  party: Party;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function PartyHeader({ party }: Props) {
  const contactItems = [
    { key: 'phone', icon: Phone, value: party.phone, dir: 'ltr' as const },
    { key: 'address', icon: MapPin, value: party.address, dir: null },
  ].filter((item) => item.value);

  const avatarGradient = party.category && PARTY_CATEGORY_AVATAR[party.category]
    ? PARTY_CATEGORY_AVATAR[party.category].gradient
    : 'from-stone-100 to-stone-200';

  const CategoryIcon = party.category && CATEGORY_ICONS[party.category]
    ? CATEGORY_ICONS[party.category]
    : null;

  return (
    <Card className="overflow-hidden border-stone-200 shadow-sm">
      <div className="h-2 bg-gradient-to-l from-emerald-500 via-emerald-400 to-stone-300" />

      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <Avatar className="hidden sm:flex h-14 w-14 rounded-xl border-2 border-stone-200 shadow-sm">
              <AvatarFallback className={`rounded-xl bg-gradient-to-br ${avatarGradient} text-stone-700`}>
                {CategoryIcon ? <CategoryIcon className="h-6 w-6" /> : initials(party.name)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-stone-900 truncate">{party.name}</h1>
                <Badge
                  variant="secondary"
                  className="rounded-full text-xs font-normal px-3 py-0.5 border"
                >
                  {party.type === 'فرد' ? (
                    <><User className="h-3 w-3 ms-1" />فرد</>
                  ) : (
                    <><Building2 className="h-3 w-3 ms-1" />شركة</>
                  )}
                </Badge>
                {party.category && <StatusBadge value={party.category} toneMap={PARTY_CATEGORY_TONE} />}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {contactItems.map((item) => (
                  <span
                    key={item.key}
                    className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600"
                    {...(item.dir ? { dir: item.dir } : {})}
                  >
                    <item.icon className="h-3.5 w-3.5 text-stone-400" />
                    {item.value}
                  </span>
                ))}
              </div>

              {party.notes && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50/70 border border-amber-200/50 p-3 text-sm text-amber-800">
                  <Notebook className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{party.notes}</span>
                </div>
              )}
            </div>
          </div>

          <Button variant="outline" size="sm" asChild className="shrink-0 shadow-sm">
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
