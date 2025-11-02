import {
  type IncomeEntry,
  type MonthlyData,
  incomeStorage,
} from './income-storage';

export interface ReportOptions {
  type: 'detailed' | 'monthly' | 'yearly';
  format: 'csv' | 'pdf';
  startDate?: string;
  endDate?: string;
  year?: number;
}

export const reportGenerator = {
  // Generate detailed entries report
  generateDetailedReport(entries: IncomeEntry[]): string {
    const headers = [
      'Date',
      'Client Name',
      'Project Description',
      'Gross Amount',
      'Tax Withheld',
      'Net Amount',
      'Payment Method',
      'Invoice Number',
      'Notes',
    ];

    const rows = entries.map((entry) => [
      new Date(entry.date).toLocaleDateString(),
      entry.clientName,
      entry.projectDescription,
      entry.grossAmount.toFixed(2),
      entry.taxWithheld.toFixed(2),
      entry.netAmount.toFixed(2),
      entry.paymentMethod.replace('_', ' '),
      entry.invoiceNumber || '',
      entry.notes || '',
    ]);

    return this.arrayToCSV([headers, ...rows]);
  },

  // Generate monthly summary report
  generateMonthlyReport(monthlyData: MonthlyData[]): string {
    const headers = [
      'Month',
      'Year',
      'Entries',
      'Gross Income',
      'Tax Withheld',
      'Net Income',
      'Tax Rate %',
    ];

    const rows = monthlyData.map((data) => [
      data.month,
      data.year.toString(),
      data.entryCount.toString(),
      data.totalGross.toFixed(2),
      data.totalTax.toFixed(2),
      data.totalNet.toFixed(2),
      ((data.totalTax / data.totalGross) * 100 || 0).toFixed(2),
    ]);

    // Add totals row
    const totals = monthlyData.reduce(
      (acc, data) => ({
        entries: acc.entries + data.entryCount,
        gross: acc.gross + data.totalGross,
        tax: acc.tax + data.totalTax,
        net: acc.net + data.totalNet,
      }),
      { entries: 0, gross: 0, tax: 0, net: 0 }
    );

    rows.push([
      'TOTAL',
      '',
      totals.entries.toString(),
      totals.gross.toFixed(2),
      totals.tax.toFixed(2),
      totals.net.toFixed(2),
      ((totals.tax / totals.gross) * 100 || 0).toFixed(2),
    ]);

    return this.arrayToCSV([headers, ...rows]);
  },

  // Generate yearly summary report
  generateYearlyReport(): string {
    const entries = incomeStorage.getAll();
    const years = [
      ...new Set(entries.map((entry) => new Date(entry.date).getFullYear())),
    ].sort((a, b) => a - b);

    const headers = [
      'Year',
      'Entries',
      'Gross Income',
      'Tax Withheld',
      'Net Income',
      'Tax Rate %',
      'YoY Growth %',
    ];

    const rows = years.map((year, index) => {
      const totals = incomeStorage.getYearlyTotals(year);
      const previousYear = index > 0 ? years[index - 1] : null;
      const previousTotals = previousYear
        ? incomeStorage.getYearlyTotals(previousYear)
        : null;
      const growth =
        previousTotals && previousTotals.totalNet > 0
          ? ((totals.totalNet - previousTotals.totalNet) /
              previousTotals.totalNet) *
            100
          : 0;

      return [
        year.toString(),
        totals.entryCount.toString(),
        totals.totalGross.toFixed(2),
        totals.totalTax.toFixed(2),
        totals.totalNet.toFixed(2),
        ((totals.totalTax / totals.totalGross) * 100 || 0).toFixed(2),
        index === 0 ? '—' : growth.toFixed(2),
      ];
    });

    return this.arrayToCSV([headers, ...rows]);
  },

  // Filter entries by date range
  filterEntriesByDateRange(
    entries: IncomeEntry[],
    startDate?: string,
    endDate?: string
  ): IncomeEntry[] {
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date('2100-12-31');
      return entryDate >= start && entryDate <= end;
    });
  },

  // Convert array to CSV string
  arrayToCSV(data: string[][]): string {
    return data
      .map((row) =>
        row
          .map((field) => {
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            if (
              field.includes(',') ||
              field.includes('"') ||
              field.includes('\n')
            ) {
              return `"${field.replace(/"/g, '""')}"`;
            }
            return field;
          })
          .join(',')
      )
      .join('\n');
  },

  // Download CSV file
  downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Generate and download report
  generateReport(options: ReportOptions): void {
    const entries = incomeStorage.getAll();
    let content = '';
    let filename = '';

    switch (options.type) {
      case 'detailed': {
        const filteredEntries = this.filterEntriesByDateRange(
          entries,
          options.startDate,
          options.endDate
        );
        content = this.generateDetailedReport(filteredEntries);
        const dateRange =
          options.startDate && options.endDate
            ? `_${options.startDate}_to_${options.endDate}`
            : '';
        filename = `income_detailed_report${dateRange}.csv`;
        break;
      }
      case 'monthly': {
        const monthlyData = incomeStorage.getMonthlyData();
        const filteredData = options.year
          ? monthlyData.filter((d) => d.year === options.year)
          : monthlyData;
        content = this.generateMonthlyReport(filteredData);
        filename = `income_monthly_report${options.year ? `_${options.year}` : ''}.csv`;
        break;
      }
      case 'yearly': {
        content = this.generateYearlyReport();
        filename = 'income_yearly_report.csv';
        break;
      }
    }

    if (content && filename) {
      this.downloadCSV(content, filename);
    }
  },
};
