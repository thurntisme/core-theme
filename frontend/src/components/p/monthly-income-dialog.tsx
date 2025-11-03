import React from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import { MonthlyDashboard } from './monthly-dashboard';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MonthlyIncomeDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="min-h-screen bg-background">
          <header className="border-b bg-card">
            <div className="container mx-auto px-0 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Monthly Income Tracker
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your freelance income and track your earnings monthly
                  </p>
                </div>
              </div>
            </div>
          </header>
          <div className="container mx-auto px-0 pt-6 pb-8">
            <MonthlyDashboard />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MonthlyIncomeDialog;
