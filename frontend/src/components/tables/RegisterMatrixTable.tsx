"use client";

import React from "react";
import { RegisterMatrix, MatrixRow } from "@/types";
import { Badge } from "@/components/common/Badge";
import { SkeletonRow } from "@/components/common/SkeletonRow";
import { useTranslation } from "@/lib/i18n";

interface RegisterMatrixTableProps {
  matrix:
    | (RegisterMatrix & { rows: (MatrixRow & { status?: string })[] })
    | null;
  isLoading: boolean;
  amountLabel: string;
  renderRowBadge?: (row: MatrixRow & { status?: string }) => React.ReactNode;
}

export function RegisterMatrixTable({
  matrix,
  isLoading,
  amountLabel,
  renderRowBadge,
}: RegisterMatrixTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            <SkeletonRow columns={8} />
            <SkeletonRow columns={8} />
            <SkeletonRow columns={8} />
          </tbody>
        </table>
      </div>
    );
  }

  if (!matrix || matrix.rows.length === 0) {
    return (
      <div className="card p-8 text-center text-slate-400">
        No farmers or entries found for this period yet.
      </div>
    );
  }

  const days = Array.from({ length: matrix.daysInMonth }, (_, i) => i + 1);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
        <h3 className="text-base font-semibold text-slate-900">
          {amountLabel}
        </h3>
        {matrix.isBalanced ? (
          <Badge tone="success">Row/column totals match</Badge>
        ) : (
          <Badge tone="warning">Mismatch — recheck entries</Badge>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3">
                {t("common.farmer")}
              </th>
              {days.map((day) => (
                <th key={day} className="px-3 py-3 text-center">
                  {day}
                </th>
              ))}
              <th className="px-4 py-3 text-right">{t("common.total")}</th>
              {renderRowBadge ? (
                <th className="px-4 py-3">{t("common.status")}</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matrix.rows.map((row) => (
              <tr key={row.farmerId} className="hover:bg-slate-50">
                <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-slate-900">
                  {row.farmerName}
                </td>
                {days.map((day) => (
                  <td
                    key={day}
                    className="px-3 py-3 text-center text-slate-600"
                  >
                    {row.dailyAmounts[day]
                      ? row.dailyAmounts[day].toFixed(0)
                      : "—"}
                  </td>
                ))}
                <td className="px-4 py-3 text-right font-semibold text-brand-700">
                  ₹{row.rowTotal.toFixed(2)}
                </td>
                {renderRowBadge ? (
                  <td className="px-4 py-3">{renderRowBadge(row)}</td>
                ) : null}
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 font-semibold text-slate-900">
            <tr>
              <td className="sticky left-0 z-10 bg-slate-50 px-4 py-3">
                {t("common.total")}
              </td>
              {days.map((day) => (
                <td key={day} className="px-3 py-3 text-center">
                  {matrix.columnTotals[day]
                    ? matrix.columnTotals[day].toFixed(0)
                    : "—"}
                </td>
              ))}
              <td className="px-4 py-3 text-right text-brand-700">
                ₹{matrix.grandTotalFromRows.toFixed(2)}
              </td>
              {renderRowBadge ? <td className="px-4 py-3" /> : null}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
