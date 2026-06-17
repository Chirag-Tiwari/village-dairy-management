import { Role } from '@/constants/roles';

export interface AuthUser {
  id: string;
  mobileNumber: string;
  role: Role;
  name: string;
  scopeId: string | null;
}

export interface Farmer {
  id: string;
  name: string;
  mobileNumber: string;
  village: string;
  category: 'GEN' | 'SC' | 'ST';
  dairyId: string;
}

export interface MilkEntry {
  id: string;
  farmerId: string;
  farmer?: { id: string; name: string; category: string };
  collectionDate: string;
  milkQuantityL: string | number;
  fat: string | number;
  snf: string | number;
  ratePerLitre: string | number;
  totalAmount: string | number;
  protsahanRate: string | number;
  protsahanAmount: string | number;
}

export interface DailyRegisterResponse {
  entries: MilkEntry[];
  totals: {
    totalMilk: number;
    totalAmount: number;
    totalProtsahan: number;
  };
}

export interface Dairy {
  id: string;
  name: string;
  village: string;
}

export interface MatrixRow {
  farmerId: string;
  farmerName: string;
  dailyAmounts: Record<string, number>;
  rowTotal: number;
}

export interface RegisterMatrix {
  year: number;
  month: number;
  daysInMonth: number;
  rows: MatrixRow[];
  columnTotals: Record<string, number>;
  grandTotalFromRows: number;
  grandTotalFromColumns: number;
  isBalanced: boolean;
}

export interface MonthlyPaymentRow extends MatrixRow {
  status: 'PENDING' | 'VERIFIED' | 'APPROVED';
}

export interface MonthlyPaymentRegister extends Omit<RegisterMatrix, 'rows'> {
  rows: MonthlyPaymentRow[];
}

export interface ProtsahanRegister extends RegisterMatrix {
  statusCounts: Record<string, number>;
}

export interface ProtsahanLedgerEntry {
  id: string;
  farmerId: string;
  collectionDate: string;
  protsahanAmount: string | number;
  status: 'PENDING' | 'APPROVED' | 'PAID';
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
}
