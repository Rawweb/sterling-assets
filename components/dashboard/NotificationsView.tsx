'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/money';
import EmptyState from '@/components/ui/EmptyState';
import type { NotificationRow } from '@/lib/notifications';

export default function NotificationsView({
  notifications,
}: {
  notifications: NotificationRow[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const hasUnread = notifications.some((n) => !n.read);

  async function markOne(id: string, alreadyRead: boolean) {
    if (alreadyRead) return;
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      router.refresh();
    } catch {
      // silent; the notification just stays unread
    }
  }

  async function markAll() {
    setBusy(true);
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      router.refresh();
    } catch {
      // silent
    } finally {
      setBusy(false);
    }
  }

  if (notifications.length === 0) {
    return (
      <div className='rounded-[14px] border border-line'>
        <EmptyState message='You have no notifications yet.' />
      </div>
    );
  }

  return (
    <>
      <div className='mb-4 flex items-center justify-end'>
        <button
          type='button'
          onClick={markAll}
          disabled={!hasUnread || busy}
          className='text-[13px] font-semibold text-primary transition hover:underline disabled:cursor-not-allowed disabled:text-muted disabled:no-underline'
        >
          {busy ? 'Marking...' : 'Mark all as read'}
        </button>
      </div>

      <div className='space-y-2.5'>
        {notifications.map((n) => (
          <button
            key={n.id}
            type='button'
            onClick={() => markOne(n.id, n.read)}
            className={`w-full rounded-[14px] border p-4 text-left transition ${
              n.read
                ? 'border-line'
                : 'border-primary/30 bg-primary/5 hover:border-primary/50'
            }`}
          >
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <p className='text-sm font-semibold'>{n.title}</p>
                <p className='mt-0.5 text-[13px] text-muted'>{n.body}</p>
              </div>
              {!n.read && (
                <span className='mt-1 size-2 shrink-0 rounded-full bg-primary' />
              )}
            </div>
            <p className='mt-2 text-[11px] text-muted'>
              {formatDate(n.createdAt)}
            </p>
          </button>
        ))}
      </div>
    </>
  );
}
