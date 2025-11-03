import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { YearlyDashboard } from './yearly-dashboard';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const YearlyIncomeDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-background">
          <header className="border-b bg-card">
            <div className="container mx-auto px-0 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Yearly Income Tracker
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your freelance income and track your earnings yearly
                  </p>
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-0 py-8">
            <YearlyDashboard />
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YearlyIncomeDialog;
