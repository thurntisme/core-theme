import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ReportGenerator } from './report-generator';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const IncomeReporterDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-background">
          <header className="border-b bg-card">
            <div className="container mx-auto px-0 py-6">
              <h1 className="text-3xl font-bold text-foreground">
                Income Reporter
              </h1>
              <p className="text-muted-foreground mt-1">
                Generate detailed reports of your freelance income and earnings
              </p>
            </div>
          </header>
          <div className="container mx-auto px-0 py-8">
            <ReportGenerator />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncomeReporterDialog;
