import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const UnsavedFormChangesDialog: React.FC<{
  open: boolean;
  cancel: () => void;
  ok: () => void;
}> = ({ open = false, cancel, ok }) => {
  return (
    <Dialog open={open} onOpenChange={cancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you don&apos;t want to keep the modifications?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="icon" onClick={cancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={ok}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
