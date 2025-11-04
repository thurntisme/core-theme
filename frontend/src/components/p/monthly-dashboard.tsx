'use client';

import { useEffect, useState } from 'react';

import { Calendar, DollarSign, FileText, TrendingUp } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type MonthlyData, incomeStorage } from '@/lib/income-storage';

export function MonthlyDashboard() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    const data = incomeStorage.getMonthlyData();
    setMonthlyData(data);

    // Get available years
    const years = [...new Set(data.map((d) => d.year))].sort((a, b) => b - a);
    setAvailableYears(years);

    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
  }, [selectedYear]);

  const filteredData = monthlyData.filter((data) => data.year === selectedYear);

  // Prepare chart data
  const chartData = filteredData.map((data) => ({
    month: data.month.substring(0, 3), // Short month name
    gross: data.totalGross,
    tax: data.totalTax,
    net: data.totalNet,
    entries: data.entryCount,
  }));

  const yearlyTotals = filteredData.reduce(
    (acc, data) => ({
      totalGross: acc.totalGross + data.totalGross,
      totalTax: acc.totalTax + data.totalTax,
      totalNet: acc.totalNet + data.totalNet,
      totalEntries: acc.totalEntries + data.entryCount,
    }),
    { totalGross: 0, totalTax: 0, totalNet: 0, totalEntries: 0 }
  );

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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Monthly Cash Flow</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Year Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Gross ({selectedYear})
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${yearlyTotals.totalGross.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {yearlyTotals.totalEntries} total payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Withheld</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${yearlyTotals.totalTax.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (yearlyTotals.totalTax / yearlyTotals.totalGross) * 100 || 0
              ).toFixed(1)}
              % of gross
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${yearlyTotals.totalNet.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              After tax withholdings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Monthly</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {filteredData.length > 0
                ? (yearlyTotals.totalNet / filteredData.length).toLocaleString()
                : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Net income per month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income Breakdown</CardTitle>
            <CardDescription>Gross vs Net income by month</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
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

        {/* Monthly Trend Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Income Trend</CardTitle>
            <CardDescription>Net income trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString()}`,
                      name,
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="var(--color-net)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-net)', strokeWidth: 2, r: 4 }}
                    name="Net Income"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer> */}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Details</CardTitle>
          <CardDescription>Detailed breakdown by month</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No data available for {selectedYear}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Month</th>
                    <th className="text-right py-2">Entries</th>
                    <th className="text-right py-2">Gross Income</th>
                    <th className="text-right py-2">Tax Withheld</th>
                    <th className="text-right py-2">Net Income</th>
                    <th className="text-right py-2">Tax Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data) => (
                    <tr key={`${data.year}-${data.month}`} className="border-b">
                      <td className="py-3 font-medium">{data.month}</td>
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
                        {((data.totalTax / data.totalGross) * 100 || 0).toFixed(
                          1
                        )}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
