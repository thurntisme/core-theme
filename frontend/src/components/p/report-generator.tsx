'use client';

import { useEffect, useState } from 'react';

import { BarChart3, Calendar, Download, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { incomeStorage } from '@/lib/p/income-storage';
import { type ReportOptions, reportGenerator } from '@/lib/p/report-generator';

export function ReportGenerator() {
  const [reportType, setReportType] = useState<
    'detailed' | 'monthly' | 'yearly'
  >('detailed');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const entries = incomeStorage.getAll();
    const years = [
      ...new Set(entries.map((entry) => new Date(entry.date).getFullYear())),
    ].sort((a, b) => b - a);
    setAvailableYears(years);

    // Set default date range to current year
    const currentYear = new Date().getFullYear();
    setStartDate(`${currentYear}-01-01`);
    setEndDate(`${currentYear}-12-31`);
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    try {
      const options: ReportOptions = {
        type: reportType,
        format: 'csv',
        ...(reportType === 'detailed' && { startDate, endDate }),
        ...(reportType === 'monthly' && { year: selectedYear }),
      };

      reportGenerator.generateReport(options);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportDescription = () => {
    switch (reportType) {
      case 'detailed':
        return 'Export all income entries with complete details including client information, amounts, and notes.';
      case 'monthly':
        return 'Export monthly summaries with totals, tax calculations, and entry counts.';
      case 'yearly':
        return 'Export yearly comparisons with growth calculations and tax rate analysis.';
      default:
        return '';
    }
  };

  const getPreviewData = () => {
    const entries = incomeStorage.getAll();

    switch (reportType) {
      case 'detailed': {
        const filteredEntries = reportGenerator.filterEntriesByDateRange(
          entries,
          startDate,
          endDate
        );
        return {
          count: filteredEntries.length,
          totalNet: filteredEntries.reduce(
            (sum, entry) => sum + entry.netAmount,
            0
          ),
        };
      }
      case 'monthly': {
        const monthlyData = incomeStorage
          .getMonthlyData()
          .filter((d) => d.year === selectedYear);
        return {
          count: monthlyData.length,
          totalNet: monthlyData.reduce((sum, data) => sum + data.totalNet, 0),
        };
      }
      case 'yearly': {
        const years = [
          ...new Set(
            entries.map((entry) => new Date(entry.date).getFullYear())
          ),
        ];
        return {
          count: years.length,
          totalNet: entries.reduce((sum, entry) => sum + entry.netAmount, 0),
        };
      }
      default:
        return { count: 0, totalNet: 0 };
    }
  };

  const previewData = getPreviewData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>
                Choose the type of report and configure export options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Type Selection */}
              <div className="space-y-3">
                <Label>Report Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Card
                    className={`cursor-pointer transition-colors ${
                      reportType === 'detailed'
                        ? 'ring-2 ring-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setReportType('detailed')}
                  >
                    <CardContent className="p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="font-medium">Detailed Entries</h3>
                      <p className="text-sm text-muted-foreground">
                        All transaction details
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-colors ${
                      reportType === 'monthly'
                        ? 'ring-2 ring-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setReportType('monthly')}
                  >
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="font-medium">Monthly Summary</h3>
                      <p className="text-sm text-muted-foreground">
                        Monthly totals & trends
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-colors ${
                      reportType === 'yearly'
                        ? 'ring-2 ring-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setReportType('yearly')}
                  >
                    <CardContent className="p-4 text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="font-medium">Yearly Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Year-over-year comparison
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Report Options */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Report Options</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {getReportDescription()}
                  </p>
                </div>

                {reportType === 'detailed' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {reportType === 'monthly' && (
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(value) =>
                        setSelectedYear(Number.parseInt(value))
                      }
                    >
                      <SelectTrigger className="w-48">
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
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>Summary of data to be exported</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Records:
                  </span>
                  <span className="font-medium">{previewData.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Net:
                  </span>
                  <span className="font-medium">
                    ${previewData.totalNet.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Format:</span>
                  <span className="font-medium">CSV</span>
                </div>
              </div>

              <Separator />

              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Download Report'}
              </Button>

              <div className="text-xs text-muted-foreground">
                The report will be downloaded as a CSV file that can be opened
                in Excel, Google Sheets, or any spreadsheet application.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
