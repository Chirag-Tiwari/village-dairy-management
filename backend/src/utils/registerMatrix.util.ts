// Shared grid-building logic for the Monthly Payment Register and the
// Protsahan Register. Both are structurally identical to the physical
// paper register: one row per farmer, one column per day of the month,
// a row total, and column totals at the bottom -- they only differ in
// which amount field feeds the cells.

export interface MatrixRow {
  farmerId: string;
  farmerName: string;
  dailyAmounts: Record<number, number>; // day of month -> amount
  rowTotal: number;
}

export interface RegisterMatrix {
  year: number;
  month: number;
  daysInMonth: number;
  rows: MatrixRow[];
  columnTotals: Record<number, number>;
  grandTotalFromRows: number;
  grandTotalFromColumns: number;
  isBalanced: boolean;
}

interface MatrixEntry {
  farmerId: string;
  collectionDate: Date;
  amount: number;
}

export function buildRegisterMatrix(
  farmers: { id: string; name: string }[],
  entries: MatrixEntry[],
  year: number,
  month: number, // 1-12
): RegisterMatrix {
  const daysInMonth = new Date(year, month, 0).getDate();

  const rows: MatrixRow[] = farmers.map((farmer) => ({
    farmerId: farmer.id,
    farmerName: farmer.name,
    dailyAmounts: {},
    rowTotal: 0,
  }));

  const rowByFarmerId = new Map(rows.map((row) => [row.farmerId, row]));

  const columnTotals: Record<number, number> = {};
  for (let day = 1; day <= daysInMonth; day++) columnTotals[day] = 0;

  for (const entry of entries) {
    const row = rowByFarmerId.get(entry.farmerId);
    if (!row) continue; // entry belongs to a farmer outside this list; ignore defensively

    const day = entry.collectionDate.getDate();
    row.dailyAmounts[day] = round2((row.dailyAmounts[day] || 0) + entry.amount);
    row.rowTotal = round2(row.rowTotal + entry.amount);
    columnTotals[day] = round2(columnTotals[day] + entry.amount);
  }

  const grandTotalFromRows = round2(rows.reduce((sum, row) => sum + row.rowTotal, 0));
  const grandTotalFromColumns = round2(Object.values(columnTotals).reduce((sum, v) => sum + v, 0));

  // Computed from the same source two different ways (row-wise vs.
  // column-wise) -- on consistent data these always match. A mismatch
  // here means something is actually wrong, not just a rounding quirk.
  const isBalanced = Math.abs(grandTotalFromRows - grandTotalFromColumns) < 0.01;

  return { year, month, daysInMonth, rows, columnTotals, grandTotalFromRows, grandTotalFromColumns, isBalanced };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
