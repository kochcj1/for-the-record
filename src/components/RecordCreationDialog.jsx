import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SchemaForm from "./SchemaForm";

export default function RecordCreationDialog({
  open,
  setOpen,
  schema,
  onNewRecordRequested,
}) {
  const [formState, setFormState] = useState({});
  const onSchemaFieldChange = (name, value) => {
    setFormState((previousFormState) => ({
      ...previousFormState,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAdd = async () => {
    const newFormState = { ...formState };
    addDefaultState(schema, newFormState);
    onNewRecordRequested(newFormState);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add record</DialogTitle>
      <DialogContent>
        <SchemaForm schema={schema} onSchemaFieldChange={onSchemaFieldChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

const addDefaultState = (schema, state) => {
  const properties = schema?.properties || {};
  Object.entries(properties).forEach((property) => {
    const [propertyName, propertyInfo] = property;
    if (!state.hasOwnProperty(propertyName)) {
      if (propertyInfo.bsonType === "bool") {
        state[propertyName] = false;
      } else if (propertyInfo.hasOwnProperty("enum")) {
        state[propertyName] = propertyInfo.enum[0];
      }
    }
  });
};
