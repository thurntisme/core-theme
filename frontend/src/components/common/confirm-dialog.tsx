import React from 'react';

import { Check, ShieldQuestion, X } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

type Props = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  onConfirm?: () => void;
};

const ConfirmDialog = ({ children, title, description, onConfirm }: Props) => {
  const onClickConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      toast({
        title: 'Confirm',
        description: 'You have successfully confirm this action.',
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children || (
          <Button className="h-8 w-8">
            <ShieldQuestion className="!h-4 !w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || 'Confirm'}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          {description || 'Are you sure you want to confirm?'}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <X className="w-4 h-4" />
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onClickConfirm()}>
            <Check className="w-4 h-4" />
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
