import { Button } from '../ui/button';

import React from 'react';

import { SaveIcon, X } from 'lucide-react';

type Props = {
  additionClassName?: string;
  onCancelEdit: () => void;
  onSaveClient: () => void;
};

const ActionButtonGroup = ({
  additionClassName = '',
  onCancelEdit,
  onSaveClient,
}: Props) => {
  return (
    <div className={`space-x-2 ${additionClassName}`}>
      <Button variant="outline" onClick={onCancelEdit}>
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>
      <Button onClick={onSaveClient}>
        <SaveIcon className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
};

export default ActionButtonGroup;
