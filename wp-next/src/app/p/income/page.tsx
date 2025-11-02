'use client';

import { useEffect, useState } from 'react';

import {
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  FileText,
  PieChart,
  Plus,
  TrendingUp,
} from 'lucide-react';

import { IncomeEntryForm } from '@/components/p/income-entry-form';
import IncomeReporterDialog from '@/components/p/income-reporter-dialog';
import MonthlyIncomeDialog from '@/components/p/monthly-income-dialog';
import YearlyIncomeDialog from '@/components/p/yearly-income-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type IncomeEntry, incomeStorage } from '@/lib/p/income-storage';

export default function HomePage() {
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [currentYear] = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [showMonthlyDashboard, setShowMonthlyDashboard] = useState(false);
  const [showYearlyDashboard, setShowYearlyDashboard] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);

  const refreshData = () => {
    setEntries(incomeStorage.getAll());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const yearlyTotals = incomeStorage.getYearlyTotals(currentYear);
  const monthlyData = incomeStorage.getMonthlyData();
  const recentEntries = entries.slice(-5).reverse();

  const handleFormSuccess = () => {
    refreshData();
  };

  const handleShowMonthlyDashboard = () => {
    setShowMonthlyDashboard(true);
    setShowForm(false);
    setShowYearlyDashboard(false);
    setShowReportGenerator(false);
  };

  const handleShowYearlyDashboard = () => {
    setShowYearlyDashboard(true);
    setShowForm(false);
    setShowMonthlyDashboard(false);
    setShowReportGenerator(false);
  };

  const handleShowReportGenerator = () => {
    setShowReportGenerator(true);
    setShowForm(false);
    setShowMonthlyDashboard(false);
    setShowYearlyDashboard(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Income Tracker
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your freelance income and track your earnings
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={handleShowReportGenerator}
            >
              <Download className="h-4 w-4" />
              Reports
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={handleShowYearlyDashboard}
            >
              <PieChart className="h-4 w-4" />
              Yearly View
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={handleShowMonthlyDashboard}
            >
              <BarChart3 className="h-4 w-4" />
              Monthly View
            </Button>
            <Button className="gap-2" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              Add Income
            </Button>
          </div>
        </div>
      </div>

      <IncomeEntryForm
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Gross ({currentYear})
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${yearlyTotals.totalGross.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {yearlyTotals.entryCount} payments received
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
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {monthlyData[monthlyData.length - 1]?.totalNet.toLocaleString() ||
                '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthlyData[monthlyData.length - 1]?.entryCount || 0} payments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Income Entries</CardTitle>
          <CardDescription>Your latest income records</CardDescription>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No income entries yet
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Entry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Tax %</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.clientName}
                    </TableCell>
                    <TableCell>{entry.projectName}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.projectDescription}
                    </TableCell>
                    <TableCell className="text-right">
                      ${entry.grossAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.taxPercentage}%
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${entry.netAmount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <YearlyIncomeDialog
        open={showYearlyDashboard}
        onOpenChange={setShowYearlyDashboard}
      />

      <MonthlyIncomeDialog
        open={showMonthlyDashboard}
        onOpenChange={setShowMonthlyDashboard}
      />

      <IncomeReporterDialog
        open={showReportGenerator}
        onOpenChange={setShowReportGenerator}
      />
    </main>
  );
}
