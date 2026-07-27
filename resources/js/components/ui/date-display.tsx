import { cn } from '@/lib/utils';

interface DateDisplayProps extends React.ComponentProps<'time'> {
  date: string | Date;
  format?: 'long' | 'short' | 'full' | 'relative';
}

function parseDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  const dateOnly = value.split('T')[0];
  const parts = dateOnly.split('-');
  if (parts.length === 3) {
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  }
  return new Date(value);
}

function formatRelative(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const absDiff = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' });

  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(diff / (1000 * 60));
  const hours = Math.round(diff / (1000 * 60 * 60));
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  const months = Math.round(diff / (1000 * 60 * 60 * 24 * 30));
  const years = Math.round(diff / (1000 * 60 * 60 * 24 * 365));

  if (absDiff < 60_000) return rtf.format(seconds, 'second');
  if (absDiff < 3_600_000) return rtf.format(minutes, 'minute');
  if (absDiff < 86_400_000) return rtf.format(hours, 'hour');
  if (absDiff < 2_592_000_000) return rtf.format(days, 'day');
  if (absDiff < 31_536_000_000) return rtf.format(months, 'month');

  return rtf.format(years, 'year');
}

function DateDisplay({
  date,
  format = 'long',
  className,
  ...props
}: DateDisplayProps) {
  const d = parseDate(date);

  if (isNaN(d.getTime())) {
    return (
      <time className={cn('font-mono', className)} {...props}>
        —
      </time>
    );
  }

  const titleFormatter = new Intl.DateTimeFormat('ar', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const displayFormatter = new Intl.DateTimeFormat('ar', {
    year: 'numeric',
    month: format === 'short' ? '2-digit' : 'long',
    day: 'numeric',
    weekday: format === 'full' ? 'long' : undefined,
  });

  return (
    <time
      dateTime={d.toISOString()}
      title={titleFormatter.format(d)}
      className={cn('font-mono', className)}
      {...props}
    >
      {format === 'relative' ? formatRelative(d) : displayFormatter.format(d)}
    </time>
  );
}

export { DateDisplay };
