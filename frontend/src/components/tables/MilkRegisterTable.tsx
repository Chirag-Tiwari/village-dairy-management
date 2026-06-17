'use client';

import React, { useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { MilkEntry, DailyRegisterResponse } from '@/types';
import { SkeletonRow } from '@/components/common/SkeletonRow';
import { useTranslation } from '@/lib/i18n';

interface MilkRegisterTableProps {
  data: DailyRegisterResponse | null;
  isLoading: boolean;
}

export function MilkRegisterTable({ data, isLoading }: MilkRegisterTableProps) {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<MilkEntry>[]>(
    () => [
      {
        accessorKey: 'farmer.name',
        header: t('common.farmer'),
        cell: ({ row }) => row.original.farmer?.name ?? '—',
      },
      {
        accessorKey: 'farmer.category',
        header: t('common.category'),
        cell: ({ row }) => row.original.farmer?.category ?? '—',
      },
      {
        accessorKey: 'milkQuantityL',
        header: `${t('common.milk')} (L)`,
        cell: ({ getValue }) => Number(getValue()).toFixed(1),
      },
      { accessorKey: 'fat', header: t('common.fat'), cell: ({ getValue }) => Number(getValue()).toFixed(1) },
      { accessorKey: 'snf', header: t('common.snf'), cell: ({ getValue }) => Number(getValue()).toFixed(1) },
      {
        accessorKey: 'ratePerLitre',
        header: t('common.ratePerLitre'),
        cell: ({ getValue }) => `₹${Number(getValue()).toFixed(2)}`,
      },
      {
        accessorKey: 'totalAmount',
        header: t('common.amount'),
        cell: ({ getValue }) => <span className="font-medium text-slate-900">₹{Number(getValue()).toFixed(2)}</span>,
      },
      {
        accessorKey: 'protsahanRate',
        header: t('common.protsahanRate'),
        cell: ({ getValue }) => `₹${Number(getValue())}/L`,
      },
      {
        accessorKey: 'protsahanAmount',
        header: t('common.protsahan'),
        cell: ({ getValue }) => <span className="font-medium text-brand-700">₹{Number(getValue()).toFixed(2)}</span>,
      },
    ],
    [t],
  );

  const table = useReactTable({
    data: data?.entries ?? [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
        <h3 className="text-base font-semibold text-slate-900">{t('milkRegister.title')}</h3>
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="input-base max-w-[200px]"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none whitespace-nowrap px-4 py-3"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columns={columns.length} />)
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                  No entries recorded for this date yet.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-slate-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {data && data.entries.length > 0 ? (
            <tfoot className="bg-slate-50 font-semibold text-slate-900">
              <tr>
                <td className="px-4 py-3" colSpan={2}>
                  {t('common.total')}
                </td>
                <td className="px-4 py-3">{data.totals.totalMilk.toFixed(1)} L</td>
                <td className="px-4 py-3" colSpan={3} />
                <td className="px-4 py-3">₹{data.totals.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3 text-brand-700">₹{data.totals.totalProtsahan.toFixed(2)}</td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 p-3 text-sm text-slate-500">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="btn-secondary px-3 py-1 text-xs disabled:opacity-40"
        >
          Prev
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="btn-secondary px-3 py-1 text-xs disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
