'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Power, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatCents, formatDate } from '@/lib/money';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import type { AdminPlan, ActiveUserPlan } from '@/lib/admin-plans';

const TABS = ['Plan Templates', 'Active Investments'] as const;
type Tab = (typeof TABS)[number];

// ─── Main view ────────────────────────────────────────────────────────────────

export default function AdminPlansView({
  plans,
  activeUserPlans,
}: {
  plans: AdminPlan[];
  activeUserPlans: ActiveUserPlan[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('Plan Templates');
  const [modal, setModal] = useState<{
    mode: 'create' | 'edit';
    plan?: AdminPlan;
  } | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [loadingCancelId, setLoadingCancelId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  async function handleToggle(plan: AdminPlan) {
    setTogglingId(plan.id);
    try {
      const res = await fetch(`/api/admin/plans/${plan.id}/toggle`, {
        method: 'POST',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? 'Action failed.');
        return;
      }
      toast.success(data.active ? 'Plan activated.' : 'Plan deactivated.');
      router.refresh();
    } catch {
      toast.error('Could not reach the server.');
    } finally {
      setTogglingId(null);
    }
  }

  async function handleCancel(id: string) {
    setLoadingCancelId(id);
    try {
      const res = await fetch(`/api/admin/user-plans/${id}/cancel`, {
        method: 'POST',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? 'Action failed.');
        return;
      }
      toast.success('Plan cancelled. Principal returned to user balance.');
      setConfirmCancelId(null);
      router.refresh();
    } catch {
      toast.error('Could not reach the server.');
    } finally {
      setLoadingCancelId(null);
    }
  }

  const USER_PLAN_COLUMNS = [
    { key: 'user', label: 'User' },
    { key: 'plan', label: 'Plan' },
    { key: 'invested', label: 'Invested' },
    { key: 'progress', label: 'Progress' },
    { key: 'accrued', label: 'Accrued profit' },
    { key: 'started', label: 'Started' },
    { key: 'actions', label: 'Actions' },
  ];

  function renderUserPlanCell(row: ActiveUserPlan, key: string) {
    switch (key) {
      case 'user':
        return (
          <div>
            <p className='font-medium'>{row.user.fullName}</p>
            <p className='text-[12px] text-muted truncate'>{row.user.email}</p>
          </div>
        );
      case 'plan':
        return <span className='font-medium'>{row.planName}</span>;
      case 'invested':
        return (
          <span className='font-mono font-semibold'>
            {formatCents(row.investedCents)}
          </span>
        );
      case 'progress':
        return (
          <span className='text-muted'>
            {row.daysPaid}/{row.durationDays} days
          </span>
        );
      case 'accrued':
        return (
          <span className='font-mono text-muted'>
            ~{formatCents(row.accruedProfitCents)}
          </span>
        );
      case 'started':
        return <span className='text-muted'>{formatDate(row.startedAt)}</span>;
      case 'actions': {
        const busy = loadingCancelId === row.id;
        if (confirmCancelId === row.id) {
          return (
            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={() => handleCancel(row.id)}
                disabled={busy}
                className='text-[12px] font-semibold text-down hover:underline disabled:opacity-50'
              >
                {busy ? 'Cancelling...' : 'Confirm cancel'}
              </button>
              <button
                type='button'
                onClick={() => setConfirmCancelId(null)}
                className='text-[12px] text-muted hover:underline'
              >
                Keep
              </button>
            </div>
          );
        }
        return (
          <button
            type='button'
            onClick={() => setConfirmCancelId(row.id)}
            disabled={!!loadingCancelId}
            className='text-[12px] font-semibold text-down hover:underline disabled:opacity-50'
          >
            Cancel plan
          </button>
        );
      }
      default:
        return null;
    }
  }

  return (
    <div>
      {/* Modal lives outside tab content so it overlays everything */}
      {modal && (
        <PlanModal
          mode={modal.mode}
          plan={modal.plan}
          onClose={() => setModal(null)}
          onSuccess={() => router.refresh()}
        />
      )}

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'Plan Templates' && (
        <div>
          <div className='mb-5 flex items-center justify-between'>
            <p className='text-sm text-muted'>
              {plans.length} plan{plans.length !== 1 ? 's' : ''}
            </p>
            <button
              type='button'
              onClick={() => setModal({ mode: 'create' })}
              className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97]'
            >
              <Plus size={16} />
              New plan
            </button>
          </div>

          {plans.length === 0 ? (
            <p className='py-10 text-center text-sm text-muted'>
              No plans yet. Create your first one.
            </p>
          ) : (
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  toggling={togglingId === plan.id}
                  onEdit={() => setModal({ mode: 'edit', plan })}
                  onToggle={() => handleToggle(plan)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'Active Investments' && (
        <DataTable
          columns={USER_PLAN_COLUMNS}
          rows={activeUserPlans}
          getId={(row) => row.id}
          searchIn={(row) =>
            `${row.user.fullName} ${row.user.email} ${row.planName}`
          }
          renderCell={renderUserPlanCell}
          mobileCard={(row) => {
            const busy = loadingCancelId === row.id;
            return (
              <div className='space-y-3'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='truncate font-medium'>{row.user.fullName}</p>
                    <p className='truncate text-[12px] text-muted'>
                      {row.user.email}
                    </p>
                  </div>
                  <Badge tone='active'>{row.planName}</Badge>
                </div>

                <div className='grid grid-cols-2 gap-3 border-y border-line py-3 text-sm'>
                  <div>
                    <p className='text-[11px] font-semibold uppercase tracking-wide text-muted'>
                      Invested
                    </p>
                    <p className='mt-1 font-mono font-semibold'>
                      {formatCents(row.investedCents)}
                    </p>
                  </div>
                  <div>
                    <p className='text-[11px] font-semibold uppercase tracking-wide text-muted'>
                      Progress
                    </p>
                    <p className='mt-1 text-muted'>
                      {row.daysPaid}/{row.durationDays} days
                    </p>
                  </div>
                  <div>
                    <p className='text-[11px] font-semibold uppercase tracking-wide text-muted'>
                      Accrued profit
                    </p>
                    <p className='mt-1 font-mono text-muted'>
                      ~{formatCents(row.accruedProfitCents)}
                    </p>
                  </div>
                  <div>
                    <p className='text-[11px] font-semibold uppercase tracking-wide text-muted'>
                      Started
                    </p>
                    <p className='mt-1 text-muted'>
                      {formatDate(row.startedAt)}
                    </p>
                  </div>
                </div>

                <div className='flex justify-end'>
                  {confirmCancelId === row.id ? (
                    <div className='flex items-center gap-3'>
                      <button
                        type='button'
                        onClick={() => handleCancel(row.id)}
                        disabled={busy}
                        className='text-[12px] font-semibold text-down hover:underline disabled:opacity-50'
                      >
                        {busy ? 'Cancelling...' : 'Confirm cancel'}
                      </button>
                      <button
                        type='button'
                        onClick={() => setConfirmCancelId(null)}
                        className='text-[12px] text-muted hover:underline'
                      >
                        Keep
                      </button>
                    </div>
                  ) : (
                    <button
                      type='button'
                      onClick={() => setConfirmCancelId(row.id)}
                      disabled={!!loadingCancelId}
                      className='text-[12px] font-semibold text-down hover:underline disabled:opacity-50'
                    >
                      Cancel plan
                    </button>
                  )}
                </div>
              </div>
            );
          }}
          emptyMessage='No active investments.'
        />
      )}
    </div>
  );
}

// ─── Plan card ────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  toggling,
  onEdit,
  onToggle,
}: {
  plan: AdminPlan;
  toggling: boolean;
  onEdit: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-[14px] border p-5 transition ${
        plan.active ? 'border-line bg-surface' : 'border-line bg-bg opacity-70'
      }`}
    >
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='font-semibold'>{plan.name}</h3>
        <Badge tone={plan.active ? 'success' : 'neutral'}>
          {plan.active ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <dl className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <dt className='text-muted'>Daily rate</dt>
          <dd className='font-semibold text-up'>{plan.dailyRatePct}%</dd>
        </div>
        <div className='flex justify-between'>
          <dt className='text-muted'>Duration</dt>
          <dd>{plan.durationDays} days</dd>
        </div>
        <div className='flex justify-between'>
          <dt className='text-muted'>Min investment</dt>
          <dd className='font-mono'>{formatCents(plan.minCents)}</dd>
        </div>
        <div className='flex justify-between'>
          <dt className='text-muted'>Max investment</dt>
          <dd className='font-mono'>
            {plan.maxCents ? formatCents(plan.maxCents) : 'Unlimited'}
          </dd>
        </div>
        <div className='flex justify-between'>
          <dt className='text-muted'>Referral bonus</dt>
          <dd>{plan.referralPct}%</dd>
        </div>
      </dl>

      <div className='mt-5 flex gap-2'>
        <button
          type='button'
          onClick={onEdit}
          className='inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line px-3 py-2 text-[13px] font-semibold transition hover:bg-bg active:scale-[0.97]'
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          type='button'
          onClick={onToggle}
          disabled={toggling}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${
            plan.active
              ? 'border border-line hover:bg-bg'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          }`}
        >
          <Power size={13} />
          {toggling ? '...' : plan.active ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
}

// ─── Create / edit modal ──────────────────────────────────────────────────────

function PlanModal({
  mode,
  plan,
  onClose,
  onSuccess,
}: {
  mode: 'create' | 'edit';
  plan?: AdminPlan;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);

    const minDollars = parseFloat(String(fd.get('min') ?? '0'));
    const maxStr = String(fd.get('max') ?? '').trim();

    const payload = {
      name: String(fd.get('name') ?? '').trim(),
      minCents: Math.round(minDollars * 100),
      maxCents: maxStr ? Math.round(parseFloat(maxStr) * 100) : null,
      dailyRatePct: parseFloat(String(fd.get('dailyRatePct') ?? '0')),
      durationDays: parseInt(String(fd.get('durationDays') ?? '0'), 10),
      referralPct: parseFloat(String(fd.get('referralPct') ?? '5')),
    };

    try {
      const url =
        mode === 'create' ? '/api/admin/plans' : `/api/admin/plans/${plan!.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      toast.success(mode === 'create' ? 'Plan created.' : 'Plan updated.');
      onSuccess();
      onClose();
    } catch {
      setError('Could not reach the server. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-primary bg-surface';

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-text/40 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl'>
        <div className='mb-5 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>
            {mode === 'create' ? 'New plan' : `Edit: ${plan?.name}`}
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='grid size-8 place-items-center rounded-lg text-muted hover:bg-bg active:scale-[0.97]'
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className='space-y-4'>
          {error && (
            <p className='rounded-lg border border-down/30 bg-down/10 px-3 py-2 text-sm text-down'>
              {error}
            </p>
          )}

          <div>
            <label className='mb-1.5 block text-sm font-medium'>
              Plan name
            </label>
            <input
              name='name'
              defaultValue={plan?.name ?? ''}
              required
              className={inputClass}
              placeholder='e.g. Asset 1'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                Min amount ($)
              </label>
              <input
                name='min'
                type='number'
                step='0.01'
                min='0.01'
                defaultValue={plan ? plan.minCents / 100 : ''}
                required
                className={inputClass}
                placeholder='100.00'
              />
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                Max amount ($)
              </label>
              <input
                name='max'
                type='number'
                step='0.01'
                min='0.01'
                defaultValue={plan?.maxCents ? plan.maxCents / 100 : ''}
                className={inputClass}
                placeholder='Unlimited if empty'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                Daily rate (%)
              </label>
              <input
                name='dailyRatePct'
                type='number'
                step='0.01'
                min='0.01'
                defaultValue={plan?.dailyRatePct ?? ''}
                required
                className={inputClass}
                placeholder='1.2'
              />
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                Duration (days)
              </label>
              <input
                name='durationDays'
                type='number'
                step='1'
                min='1'
                defaultValue={plan?.durationDays ?? ''}
                required
                className={inputClass}
                placeholder='30'
              />
            </div>
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-medium'>
              Referral bonus (%)
            </label>
            <input
              name='referralPct'
              type='number'
              step='0.1'
              min='0'
              defaultValue={plan?.referralPct ?? 5}
              required
              className={inputClass}
              placeholder='5'
            />
          </div>

          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 rounded-xl border border-line px-4 py-3 text-sm font-semibold transition hover:bg-bg active:scale-[0.97]'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={submitting}
              className='flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-surface transition hover:bg-primary-press active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60'
            >
              {submitting
                ? 'Saving...'
                : mode === 'create'
                  ? 'Create plan'
                  : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
