'use client';

import { formatDate } from '@/lib/money';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import type { AuditLogRow } from '@/lib/admin-audit';

const COLUMNS = [
  { key: 'action', label: 'Action' },
  { key: 'admin', label: 'Admin' },
  { key: 'target', label: 'Target ID' },
  { key: 'date', label: 'Date' },
];

type BadgeTone = 'success' | 'danger' | 'active' | 'neutral' | 'pending';

const ACTION_META: Record<string, { label: string; tone: BadgeTone }> = {
  DEPOSIT_APPROVED: { label: 'Deposit approved', tone: 'success' },
  DEPOSIT_REJECTED: { label: 'Deposit rejected', tone: 'danger' },
  WITHDRAWAL_APPROVED: { label: 'Withdrawal approved', tone: 'success' },
  WITHDRAWAL_REJECTED: { label: 'Withdrawal rejected', tone: 'danger' },
  KYC_APPROVED: { label: 'KYC approved', tone: 'success' },
  KYC_REJECTED: { label: 'KYC rejected', tone: 'danger' },
  PLAN_CREATED: { label: 'Plan created', tone: 'active' },
  PLAN_UPDATED: { label: 'Plan updated', tone: 'active' },
  PLAN_ACTIVATED: { label: 'Plan activated', tone: 'success' },
  PLAN_DEACTIVATED: { label: 'Plan deactivated', tone: 'neutral' },
  USER_PLAN_CANCELLED: { label: 'Plan cancelled', tone: 'danger' },
  WALLET_ADDRESS_UPDATED: { label: 'Wallet address updated', tone: 'pending' },
};

function actionMeta(action: string) {
  return ACTION_META[action] ?? { label: action, tone: 'neutral' as BadgeTone };
}

// Show just enough of the ID for cross-referencing without cluttering the row.
function truncateId(id: string) {
  return `${id.slice(0, 8)}…`;
}

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

export default function AdminAuditView({ logs }: { logs: AuditLogRow[] }) {
  function renderCell(row: AuditLogRow, key: string) {
    switch (key) {
      case 'action': {
        const { label, tone } = actionMeta(row.action);
        return <Badge tone={tone}>{label}</Badge>;
      }

      case 'admin':
        return <span className='font-medium'>{row.adminName}</span>;

      case 'target':
        return (
          <span className='font-mono text-[12px] text-muted'>
            {truncateId(row.targetId)}
          </span>
        );

      case 'date':
        return (
          <span className='text-[12px] text-muted'>
            {formatDateTime(row.createdAt)}
          </span>
        );

      default:
        return null;
    }
  }

  return (
    <div>
      <p className='mb-5 text-sm text-muted'>
        Every admin action is recorded here. Showing the most recent 500
        entries.
      </p>
      <DataTable
        columns={COLUMNS}
        rows={logs}
        getId={(row) => row.id}
        searchIn={(row) =>
          `${row.adminName} ${actionMeta(row.action).label} ${row.targetId}`
        }
        renderCell={renderCell}
        mobileCard={(row) => {
          const { label, tone } = actionMeta(row.action);
          return (
            <div className='space-y-3'>
              <div className='flex items-start justify-between gap-3'>
                <Badge tone={tone}>{label}</Badge>
                <span className='text-[12px] text-muted'>
                  {formatDate(row.createdAt)}
                </span>
              </div>

              <div className='flex items-center justify-between border-t border-line pt-3 text-sm'>
                <span className='font-medium'>{row.adminName}</span>
                <span className='font-mono text-[12px] text-muted'>
                  {truncateId(row.targetId)}
                </span>
              </div>
            </div>
          );
        }}
        emptyMessage='No actions recorded yet.'
      />
    </div>
  );
}
