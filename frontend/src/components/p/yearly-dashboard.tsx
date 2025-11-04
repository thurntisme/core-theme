'use client';

import { useEffect, useState } from 'react';

import {
  DollarSign,
  FileText,
  Percent,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { incomeStorage } from '@/lib/income-storage';

interface YearlyData {
  year: number;
  totalGross: number;
  totalTax: number;
  totalNet: number;
  entryCount: number;
  avgMonthly: number;
  taxRate: number;
}

export function YearlyDashboard() {
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  useEffect(() => {
    const entries = incomeStorage.getAll();
    const years = [
      ...new Set(entries.map((entry) => new Date(entry.date).getFullYear())),
    ].sort((a, b) => a - b);

    const data = years.map((year) => {
      const totals = incomeStorage.getYearlyTotals(year);
      const monthlyData = incomeStorage
        .getMonthlyData()
        .filter((d) => d.year === year);

      return {
        year,
        totalGross: totals.totalGross,
        totalTax: totals.totalTax,
        totalNet: totals.totalNet,
        entryCount: totals.entryCount,
        avgMonthly:
          monthlyData.length > 0 ? totals.totalNet / monthlyData.length : 0,
        taxRate:
          totals.totalGross > 0
            ? (totals.totalTax / totals.totalGross) * 100
            : 0,
      };
    });

    setYearlyData(data);
  }, []);

  const chartData = yearlyData.map((data) => ({
    year: data.year.toString(),
    gross: data.totalGross,
    net: data.totalNet,
    tax: data.totalTax,
    entries: data.entryCount,
    taxRate: data.taxRate,
  }));

  const currentYear = new Date().getFullYear();
  const currentYearData = yearlyData.find((d) => d.year === currentYear);
  const previousYearData = yearlyData.find((d) => d.year === currentYear - 1);

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const netGrowth =
    currentYearData && previousYearData
      ? calculateGrowth(currentYearData.totalNet, previousYearData.totalNet)
      : 0;

  const grossGrowth =
    currentYearData && previousYearData
      ? calculateGrowth(currentYearData.totalGross, previousYearData.totalGross)
      : 0;

  const chartConfig = {
    gross: {
      label: 'Gross Income',
      color: 'hsl(var(--chart-1))',
    },
    net: {
      label: 'Net Income',
      color: 'hsl(var(--chart-2))',
    },
    tax: {
      label: 'Tax Withheld',
      color: 'hsl(var(--chart-3))',
    },
    taxRate: {
      label: 'Tax Rate %',
      color: 'hsl(var(--chart-4))',
    },
  };

  const totalAllTime = yearlyData.reduce(
    (acc, data) => ({
      totalGross: acc.totalGross + data.totalGross,
      totalTax: acc.totalTax + data.totalTax,
      totalNet: acc.totalNet + data.totalNet,
      totalEntries: acc.totalEntries + data.entryCount,
    }),
    { totalGross: 0, totalTax: 0, totalNet: 0, totalEntries: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              All-Time Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalAllTime.totalNet.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Net income across all years
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YoY Growth</CardTitle>
            {netGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${netGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {netGrowth >= 0 ? '+' : ''}
              {netGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Net income vs last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Tax Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                (totalAllTime.totalTax / totalAllTime.totalGross) * 100 || 0
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">Across all years</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payments
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAllTime.totalEntries}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time payment count
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yearly Income Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Yearly Income Comparison</CardTitle>
            <CardDescription>Gross vs Net income by year</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString()}`,
                      name,
                    ]}
                  />
                  <Bar
                    dataKey="gross"
                    fill="var(--color-gross)"
                    name="Gross Income"
                  />
                  <Bar
                    dataKey="net"
                    fill="var(--color-net)"
                    name="Net Income"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer> */}
          </CardContent>
        </Card>

        {/* Tax Rate Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Rate Trend</CardTitle>
            <CardDescription>
              Tax withholding percentage over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      `${Number(value).toFixed(1)}%`,
                      name,
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="taxRate"
                    stroke="var(--color-taxRate)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-taxRate)', strokeWidth: 2, r: 4 }}
                    name="Tax Rate %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer> */}
          </CardContent>
        </Card>
      </div>

      {/* Yearly Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Yearly Summary</CardTitle>
          <CardDescription>
            Detailed breakdown by year with growth calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {yearlyData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Year</th>
                    <th className="text-right py-2">Payments</th>
                    <th className="text-right py-2">Gross Income</th>
                    <th className="text-right py-2">Tax Withheld</th>
                    <th className="text-right py-2">Net Income</th>
                    <th className="text-right py-2">Tax Rate</th>
                    <th className="text-right py-2">YoY Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyData.map((data, index) => {
                    const previousYear =
                      index > 0 ? yearlyData[index - 1] : null;
                    const growth = previousYear
                      ? calculateGrowth(data.totalNet, previousYear.totalNet)
                      : 0;

                    return (
                      <tr key={data.year} className="border-b">
                        <td className="py-3 font-medium">{data.year}</td>
                        <td className="text-right py-3">{data.entryCount}</td>
                        <td className="text-right py-3">
                          ${data.totalGross.toLocaleString()}
                        </td>
                        <td className="text-right py-3">
                          ${data.totalTax.toLocaleString()}
                        </td>
                        <td className="text-right py-3 font-medium">
                          ${data.totalNet.toLocaleString()}
                        </td>
                        <td className="text-right py-3">
                          {data.taxRate.toFixed(1)}%
                        </td>
                        <td
                          className={`text-right py-3 ${
                            index === 0
                              ? 'text-muted-foreground'
                              : growth >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                          }`}
                        >
                          {index === 0
                            ? '—'
                            : `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
