import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function storageKeyFor(slug: string): string {
  return `dialog-form:${slug}:${window.location.pathname}`;
}

interface Snapshot {
  data?: Record<string, unknown>;
  errors?: Record<string, string>;
  seen?: boolean;
}

function readSnapshot(key: string): Snapshot | null {
  try {
    const raw = sessionStorage.getItem(key);

    return raw ? (JSON.parse(raw) as Snapshot) : null;
  } catch {
    return null;
  }
}

function writeSnapshot(key: string, snap: Snapshot): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(snap));
  } catch {
    // Storage unavailable — the form simply behaves as before.
  }
}

/**
 * Keeps a dialog form alive across redirect remounts.
 *
 * Why it exists: pages with `<Deferred>` blocks remount on every visit with
 * a fresh key, so an uncontrolled dialog closes and its typed data is lost
 * on a failed submit — even though the errors reach the page props.
 *
 * Protocol:
 * - `snapshotDialogForm` stores the typed data at submit time.
 * - On mount the snapshot is restored (data re-applied) and the dialog
 *   reopens whenever errors for its fields are known — from the current
 *   page props or from a previous mount that already saw them (deferred
 *   reloads wipe the page error bag, so seen errors are carried forward).
 * - The snapshot is dropped on manual close and on mounts with neither
 *   errors nor a previously seen error (e.g. after a successful submit).
 */
export function snapshotDialogForm(slug: string, data: Record<string, unknown>): void {
  writeSnapshot(storageKeyFor(slug), { data });
}

interface PersistentDialogFormOptions {
  slug: string;
  fieldKeys: string[];
  data: Record<string, unknown>;
  setData: (key: string, value: string) => void;
  setError: (errors: Record<string, string>) => void;
}

export function usePersistentDialogForm(options: PersistentDialogFormOptions): {
  open: boolean;
  onOpenChange: (open: boolean) => void;
} {
  const { slug, fieldKeys, data, setData, setError } = options;
  const pageErrors = (usePage().props.errors ?? {}) as Record<string, string>;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const key = storageKeyFor(slug);
    const snap = readSnapshot(key);

    if (!snap?.data) {
      return;
    }

    const freshErrors: Record<string, string> = {};

    fieldKeys.forEach((field) => {
      if (pageErrors[field]) {
        freshErrors[field] = pageErrors[field];
      }
    });

    const carriedErrors: Record<string, string> = {};

    Object.entries(snap.errors ?? {}).forEach(([field, message]) => {
      if (fieldKeys.includes(field)) {
        carriedErrors[field] = message;
      }
    });

    const errors = { ...carriedErrors, ...freshErrors };

    if (Object.keys(errors).length === 0 && !snap.seen) {
      sessionStorage.removeItem(key);

      return;
    }

    Object.entries(snap.data).forEach(([field, value]) => {
      if (typeof value === 'string') {
        setData(field, value);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        setData(field, String(value));
      }
    });

    if (Object.keys(errors).length > 0) {
      setError(errors);
      setOpen(true);
      writeSnapshot(key, { data: snap.data, errors, seen: true });
    }
    // Mount-only restore pass.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onOpenChange(next: boolean): void {
    if (!next) {
      sessionStorage.removeItem(storageKeyFor(slug));
    }

    setOpen(next);
  }

  return { open, onOpenChange };
}
