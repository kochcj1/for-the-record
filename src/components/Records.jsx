import React, { useState } from "react";
import Title from "./Title";
import Subtitle from "./Subtitle";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import useRecords from "../hooks/useRecords";
import { SERVER_BASE_URL } from "../utils/env";
import { Button } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import RecordDialog from "./RecordDialog";
import RecordDeletionDialog from "./RecordDeletionDialog";
import "../styles/records.css";

// TODO: update table right away after record is added, update, or deleted
// TODO: handle loading and errors (GET, POST, PUT, and DELETE errors)
// TODO: disable Add button if there are required fields that aren't yet filled out
// TODO: make records editable

export default function Records({ group, table }) {
  const { isLoading, isError, error, isSuccess, data } = useRecords(
    SERVER_BASE_URL,
    group,
    table
  );
  const schema = data?.schema;
  const propertyNames = Object.keys(schema?.properties || {});
  const records = data?.records || [];

  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const handleAddButtonClick = () => {
    setRecordDialogOpen(true);
  };

  // The user's filled out the record's form dialog and has requested to add it, so
  // so ahead and make a POST request to the backend to add the requested record:
  const handleNewRecordRequested = async (formState) => {
    const url = `${SERVER_BASE_URL}/api/${group}/${table}/records`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setRecordDialogOpen(false);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  // TODO
  const handleEditButtonClick = (recordId) => {
    console.log(recordId);
  };

  const [recordIdToDelete, setRecordIdToDelete] = useState(undefined);
  const handleDeleteButtonClick = (recordId) => {
    setRecordIdToDelete(recordId);
  };

  // The user has confimed that they want to delete a record, so tell the backend to
  // delete it:
  const handleRecordDeletionRequested = async (recordId) => {
    const url = `${SERVER_BASE_URL}/api/${group}/${table}/records/${recordId}?soft=true`;
    try {
      const response = await fetch(url, { method: "DELETE" });

      if (response.ok) {
        setRecordIdToDelete(undefined);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <React.Fragment>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Title>{group}</Title>
        {isSuccess && (
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={handleAddButtonClick}
          >
            Add record
          </Button>
        )}
      </div>
      <Subtitle>{table}</Subtitle>
      {records && records.length > 0 && (
        <React.Fragment>
          <DataGrid
            columns={getColumns(
              propertyNames,
              handleEditButtonClick,
              handleDeleteButtonClick
            )}
            rows={records.map((record) => {
              const { _id, ...rest } = record;
              return { id: _id, ...rest };
            })}
            density="compact"
            rowSelection={false}
            sx={{ marginTop: "1em" }}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : ""
            }
          />
        </React.Fragment>
      )}
      <RecordDialog
        open={recordDialogOpen}
        setOpen={setRecordDialogOpen}
        schema={schema}
        onNewRecordRequested={handleNewRecordRequested}
      />
      <RecordDeletionDialog
        recordIdToDelete={recordIdToDelete}
        setRecordIdToDelete={setRecordIdToDelete}
        onDeletionRequested={handleRecordDeletionRequested}
      />
    </React.Fragment>
  );
}

function getColumns(propertyNames, onEditButtonClick, onDeleteButtonClick) {
  const propertyColumns = propertyNames.map((name) => {
    return { field: name, width: 175 };
  });

  return [
    {
      field: "actions",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => onEditButtonClick(params.id)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => onDeleteButtonClick(params.id)}
        />,
      ],
    },
    ...propertyColumns,
  ];
}
