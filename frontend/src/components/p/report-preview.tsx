'use client';

import { useState } from 'react';

import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { DailyReport } from '@/types/portal';

interface ReportPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: DailyReport | null;
}

export function ReportPreview({
  open,
  onOpenChange,
  report,
}: ReportPreviewProps) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const formatReportContent = () => {
    return `DAILY REPORT

Date: ${report.date}
Reporter: ${report.name}
Project: ${report.project}

COMPLETED TASKS:
${report.completedTasks
  .map(
    (task, index) =>
      `${index + 1}. ${task.task}${task.note ? `\n   Note: ${task.note}` : ''}`
  )
  .join('\n')}

IN PROGRESS:
${report.inProgressTasks
  .map(
    (task, index) =>
      `${index + 1}. ${task.task}${task.progress ? `\n   Progress: ${task.progress}` : ''}`
  )
  .join('\n')}

BLOCKERS / ISSUES:
${report.blockers
  .map(
    (blocker, index) =>
      `${index + 1}. ${blocker.task}${blocker.issue ? `\n   Issue: ${blocker.issue}` : ''}`
  )
  .join('\n')}

NEXT PLAN (Tomorrow):
${report.nextPlan
  .map(
    (plan, index) =>
      `${index + 1}. ${plan.task}${plan.description ? `\n   Details: ${plan.description}` : ''}`
  )
  .join('\n')}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatReportContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report Preview</DialogTitle>
        </DialogHeader>
        <div className="bg-muted p-6 my-2 rounded-lg font-mono text-sm whitespace-pre-line">
          {formatReportContent()}
        </div>
        <div className="text-center">
          <Button onClick={handleCopy} variant="outline" size="sm">
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy Content'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
