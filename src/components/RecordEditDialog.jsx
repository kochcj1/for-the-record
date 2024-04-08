import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SchemaForm from "./SchemaForm";

export default function RecordEditDialog({
  recordToEdit,
  setRecordToEdit,
  schema,
  onRecordEditRequested,
}) {
  const [formState, setFormState] = useState(recordToEdit);
  const onSchemaFieldChange = (name, value) => {
    setFormState((previousFormState) => ({
      ...previousFormState,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setRecordToEdit(undefined);
  };
  const handleEdit = async () => {
    onRecordEditRequested(formState);
  };

  return (
    <Dialog open={Boolean(recordToEdit)} onClose={handleClose}>
      <DialogTitle>Edit record</DialogTitle>
      <DialogContent>
        <SchemaForm
          schema={schema}
          defaultValues={recordToEdit}
          onSchemaFieldChange={onSchemaFieldChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleEdit}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}
