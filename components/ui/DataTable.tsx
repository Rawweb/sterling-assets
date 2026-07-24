'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Search } from 'lucide-react';
import { pageSizeOptions } from '@/lib/dashboard-data';

export type Column = {
  key: string;
  label: string;
  align?: 'left' | 'right';
};

type Props<T> = {
  columns: Column[];
  rows: T[];
  getId: (row: T) => string;
  searchIn: (row: T) => string;
  renderCell: (row: T, key: string) => ReactNode;
  emptyMessage?: string;
};

export default function DataTable<T>({
  columns,
  rows,
  getId,
  searchIn,
  renderCell,
  emptyMessage = 'No records to show yet.',
}: Props<T>) {
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => searchIn(row).toLowerCase().includes(q));
  }, [rows, query, searchIn]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  const grid = {
    gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
  };

  return (
    <div>
      <div className='mb-3.5 flex flex-wrap items-center justify-between gap-3'>
        <label className='flex items-center gap-2 text-[13px] text-muted'>
          Show
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className='rounded-lg border border-line px-2 py-1.5'
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          entries
        </label>

        <label className='flex items-center gap-1.5 rounded-[9px] border border-line px-2.5 text-muted focus-within:border-primary'>
          <Search size={14} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search'
            aria-label='Search records'
            className='bg-transparent py-2.5 text-[13px] outline-none'
          />
        </label>
      </div>

      <div className='overflow-x-auto'>
        <div className='min-w-[620px]'>
          <div
            style={grid}
            className='grid gap-3 rounded-lg bg-bg p-3 text-xs font-semibold text-muted'
          >
            {columns.map((c) => (
              <span
                key={c.key}
                className={c.align === 'right' ? 'text-right' : ''}
              >
                {c.label}
              </span>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className='border-b border-line px-3 py-9 text-center text-sm text-muted'>
              {emptyMessage}
            </div>
          ) : (
            visible.map((row) => (
              <div
                key={getId(row)}
                style={grid}
                className='grid items-center gap-3 border-b border-line p-3 text-sm'
              >
                {columns.map((c) => (
                  <span
                    key={c.key}
                    className={c.align === 'right' ? 'text-right' : ''}
                  >
                    {renderCell(row, c.key)}
                  </span>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-2.5 pt-3.5 text-[13px] text-muted'>
        <span>
          Showing {total === 0 ? 0 : start + 1} to {start + visible.length} of{' '}
          {total} entries
        </span>
        <div className='flex gap-2'>
          <button
            type='button'
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
            className='rounded-lg border border-line px-3.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Previous
          </button>
          <button
            type='button'
            disabled={current >= pageCount}
            onClick={() => setPage(current + 1)}
            className='rounded-lg border border-line px-3.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
