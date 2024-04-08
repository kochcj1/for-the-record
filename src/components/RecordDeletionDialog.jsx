import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function RecordDeletionDialog({
  recordIdToDelete,
  setRecordIdToDelete,
  onDeletionRequested,
}) {
  return (
    <Dialog
      open={Boolean(recordIdToDelete)}
      onClose={() => setRecordIdToDelete(undefined)}
    >
      <DialogTitle>Delete record</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this record?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setRecordIdToDelete(undefined)}>Cancel</Button>
        <Button onClick={() => onDeletionRequested(recordIdToDelete)}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
