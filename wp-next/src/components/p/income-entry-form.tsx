'use client';

import type React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { incomeStorage } from '@/lib/p/income-storage';

interface IncomeEntryFormProps {
  open: boolean; // converted to modal props
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function IncomeEntryForm({
  open,
  onOpenChange,
  onSuccess,
}: IncomeEntryFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    projectName: '', // added project name field
    projectDescription: '',
    grossAmount: '',
    taxPercentage: '0', // added tax percentage field with default 0
    paymentMethod: '' as 'check' | 'bank_transfer' | 'paypal' | 'other' | '',
    invoiceNumber: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.projectName.trim()) {
      // added project name validation
      newErrors.projectName = 'Project name is required';
    }

    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Project description is required';
    }

    if (!formData.grossAmount || Number.parseFloat(formData.grossAmount) <= 0) {
      newErrors.grossAmount = 'Gross amount must be greater than 0';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const grossAmount = Number.parseFloat(formData.grossAmount);
      const taxPercentage = Number.parseFloat(formData.taxPercentage); // calculate tax from percentage
      const taxWithheld = (grossAmount * taxPercentage) / 100;

      incomeStorage.add({
        date: formData.date,
        clientName: formData.clientName.trim(),
        projectName: formData.projectName.trim(), // added project name to storage
        projectDescription: formData.projectDescription.trim(),
        grossAmount,
        taxWithheld,
        taxPercentage, // store tax percentage
        netAmount: grossAmount - taxWithheld,
        paymentMethod: formData.paymentMethod as
          | 'check'
          | 'bank_transfer'
          | 'paypal'
          | 'other',
        invoiceNumber: formData.invoiceNumber.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        clientName: '',
        projectName: '', // reset project name
        projectDescription: '',
        grossAmount: '',
        taxPercentage: '0', // reset tax percentage
        paymentMethod: '',
        invoiceNumber: '',
        notes: '',
      });

      onSuccess?.();
      onOpenChange(false); // close modal on success
    } catch (error) {
      console.error('Error saving income entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const grossAmount = Number.parseFloat(formData.grossAmount) || 0;
  const taxPercentage = Number.parseFloat(formData.taxPercentage) || 0;
  const taxWithheld = (grossAmount * taxPercentage) / 100;
  const netAmount = grossAmount - taxWithheld;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Income Entry</DialogTitle>
          <DialogDescription>
            Record a new payment or income received
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date Received</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    paymentMethod: value as typeof formData.paymentMethod,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMethod && (
                <p className="text-sm text-destructive">
                  {errors.paymentMethod}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
              placeholder="Enter client or company name"
            />
            {errors.clientName && (
              <p className="text-sm text-destructive">{errors.clientName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) =>
                setFormData({ ...formData, projectName: e.target.value })
              }
              placeholder="Enter project name"
            />
            {errors.projectName && (
              <p className="text-sm text-destructive">{errors.projectName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription">Project Description</Label>
            <Input
              id="projectDescription"
              value={formData.projectDescription}
              onChange={(e) =>
                setFormData({ ...formData, projectDescription: e.target.value })
              }
              placeholder="Brief description of the work performed"
            />
            {errors.projectDescription && (
              <p className="text-sm text-destructive">
                {errors.projectDescription}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grossAmount">Gross Amount ($)</Label>
              <Input
                id="grossAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.grossAmount}
                onChange={(e) =>
                  setFormData({ ...formData, grossAmount: e.target.value })
                }
                placeholder="0.00"
              />
              {errors.grossAmount && (
                <p className="text-sm text-destructive">{errors.grossAmount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxPercentage">Tax %</Label>
              <Select
                value={formData.taxPercentage}
                onValueChange={(value) =>
                  setFormData({ ...formData, taxPercentage: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tax %" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tax Withheld ($)</Label>
              <div className="h-10 px-3 py-2 border border-input bg-muted rounded-md flex items-center text-sm">
                {taxWithheld.toFixed(2)}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Net Amount ($)</Label>
              <div className="h-10 px-3 py-2 border border-input bg-muted rounded-md flex items-center text-sm">
                {netAmount.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number (Optional)</Label>
            <Input
              id="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={(e) =>
                setFormData({ ...formData, invoiceNumber: e.target.value })
              }
              placeholder="Invoice or reference number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes or details"
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
