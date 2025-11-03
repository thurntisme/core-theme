import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Client } from '@/types/portal';

import ActionButtonGroup from './action-button-group';

type Props = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: Client;
  setFormData: React.Dispatch<React.SetStateAction<Client>>;
  onSaveClient: () => void;
  onCancelEdit: () => void;
};

const EditClientDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  formData,
  setFormData,
  onSaveClient,
  onCancelEdit,
}: Props) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>Update client information.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Client full name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="client@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-company">Company</Label>
            <Input
              id="edit-company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="Company name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-website">Website</Label>
            <Input
              id="edit-website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes about the client..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <ActionButtonGroup
            additionClassName="w-full flex justify-center"
            onCancelEdit={onCancelEdit}
            onSaveClient={onSaveClient}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
