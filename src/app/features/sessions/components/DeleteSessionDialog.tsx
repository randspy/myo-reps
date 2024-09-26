import { DeleteConfirmationDialog } from '@/app/ui/DeleteConfirmationDialog';
import { SessionValue } from '../session-schema';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useSession } from '../hooks/useSession';

export const DeleteSessionDialog: React.FC<{ session: SessionValue }> = ({
  session,
}) => {
  const [open, setOpen] = useState(false);
  const { deleteSession } = useSession();

  const deleteById = () => {
    deleteSession(session.id);
    setOpen(false);
  };

  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={setOpen}
      title="Are you sure you want to delete this session?"
      description="This action cannot be undone."
      onDelete={deleteById}
    >
      <Button variant="icon" size="icon" aria-label="Delete session">
        <Trash2Icon className="h-4 w-4" />
      </Button>
    </DeleteConfirmationDialog>
  );
};
