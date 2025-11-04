export interface IncomeEntry {
  id: string;
  date: string;
  clientName: string;
  projectName: string; // added project name field
  projectDescription: string;
  grossAmount: number;
  taxWithheld: number;
  taxPercentage: number; // added tax percentage field
  netAmount: number;
  paymentMethod: 'check' | 'bank_transfer' | 'paypal' | 'other';
  invoiceNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface MonthlyData {
  month: string;
  year: number;
  totalGross: number;
  totalTax: number;
  totalNet: number;
  entryCount: number;
}

const STORAGE_KEY = 'freelancer_income_entries';

export const incomeStorage = {
  // Get all income entries
  getAll(): IncomeEntry[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Add new income entry
  add(entry: Omit<IncomeEntry, 'id' | 'createdAt'>): IncomeEntry {
    const newEntry: IncomeEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const entries = this.getAll();
    entries.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
  },

  // Update existing entry
  update(id: string, updates: Partial<IncomeEntry>): IncomeEntry | null {
    const entries = this.getAll();
    const index = entries.findIndex((entry) => entry.id === id);

    if (index === -1) return null;

    entries[index] = { ...entries[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return entries[index];
  },

  // Delete entry
  delete(id: string): boolean {
    const entries = this.getAll();
    const filtered = entries.filter((entry) => entry.id !== id);

    if (filtered.length === entries.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Get monthly summary data
  getMonthlyData(): MonthlyData[] {
    const entries = this.getAll();
    const monthlyMap = new Map<string, MonthlyData>();

    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          month: date.toLocaleString('default', { month: 'long' }),
          year: date.getFullYear(),
          totalGross: 0,
          totalTax: 0,
          totalNet: 0,
          entryCount: 0,
        });
      }

      const monthData = monthlyMap.get(monthKey)!;
      monthData.totalGross += entry.grossAmount;
      monthData.totalTax += entry.taxWithheld;
      monthData.totalNet += entry.netAmount;
      monthData.entryCount += 1;
    });

    return Array.from(monthlyMap.values()).sort(
      (a, b) =>
        new Date(`${a.year}-${a.month}`).getTime() -
        new Date(`${b.year}-${b.month}`).getTime()
    );
  },

  // Get yearly totals
  getYearlyTotals(year: number) {
    const entries = this.getAll().filter(
      (entry) => new Date(entry.date).getFullYear() === year
    );

    return entries.reduce(
      (totals, entry) => ({
        totalGross: totals.totalGross + entry.grossAmount,
        totalTax: totals.totalTax + entry.taxWithheld,
        totalNet: totals.totalNet + entry.netAmount,
        entryCount: totals.entryCount + 1,
      }),
      {
        totalGross: 0,
        totalTax: 0,
        totalNet: 0,
        entryCount: 0,
      }
    );
  },
};
