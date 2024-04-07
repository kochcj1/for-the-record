import React, { useState } from "react";
import Title from "./Title";
import Subtitle from "./Subtitle";
import { DataGrid } from "@mui/x-data-grid";
import useRecords from "../hooks/useRecords";
import { SERVER_BASE_URL } from "../utils/env";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import SchemaForm from "./SchemaForm";

export default function Records({ group, table }) {
  const { isLoading, isError, error, isSuccess, data } = useRecords(
    SERVER_BASE_URL,
    group,
    table
  );
  const schema = data?.schema;
  const records = data?.records;

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Title>{group}</Title>
        {isSuccess && (
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={handleClickOpen}
          >
            Add record
          </Button>
        )}
      </div>
      <Subtitle>{table}</Subtitle>
      {records && records.length > 0 && <DataGrid columns={[]} />}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add record</DialogTitle>
        <DialogContent>
          <SchemaForm schema={schema} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
