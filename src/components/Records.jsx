import React, { useState, useEffect } from "react";
import Title from "./Title";
import Subtitle from "./Subtitle";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import useRecords from "../hooks/useRecords";
import { SERVER_BASE_URL } from "../utils/env";
import { Button } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import RecordCreationDialog from "./RecordCreationDialog";
import RecordEditDialog from "./RecordEditDialog";
import RecordDeletionDialog from "./RecordDeletionDialog";
import "../styles/records.css";

export default function Records({ group, table }) {
  const { isLoading, isError, error, isSuccess, data } = useRecords(
    SERVER_BASE_URL,
    group,
    table
  );
  const schema = data?.schema;
  const propertyNames = Object.keys(schema?.properties || {});
  const records = data?.records || [];
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(
      records.map((record) => {
        const { _id, ...rest } = record;
        return { id: _id, ...rest };
      })
    );
  }, [data]);

  const [recordCreationDialogOpen, setRecordCreationDialogOpen] =
    useState(false);
  const handleAddButtonClick = () => {
    setRecordCreationDialogOpen(true);
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
        const body = await response.json();
        const newRow = {
          ...formState,
          id: body.recordId,
        };
        setRows((previousRows) => [...previousRows, newRow]);
        setRecordCreationDialogOpen(false);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  const [recordToEdit, setRecordToEdit] = useState(undefined);
  const handleEditButtonClick = (record) => {
    setRecordToEdit(record);
  };

  // The user has confirmed that they want to apply their changes to a record, so
  // tell the backend to update it:
  const handleRecordEditRequested = async (record) => {
    const { id, ...rest } = record;
    const url = `${SERVER_BASE_URL}/api/${group}/${table}/records/${id}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      });

      if (response.ok) {
        setRecordToEdit(undefined);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const [recordIdToDelete, setRecordIdToDelete] = useState(undefined);
  const handleDeleteButtonClick = (recordId) => {
    setRecordIdToDelete(recordId);
  };

  // The user has confirmed that they want to delete a record, so tell the backend to
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
            rows={rows}
            density="compact"
            rowSelection={false}
            sx={{ marginTop: "1em" }}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : ""
            }
          />
        </React.Fragment>
      )}
      <RecordCreationDialog
        open={recordCreationDialogOpen}
        setOpen={setRecordCreationDialogOpen}
        schema={schema}
        onNewRecordRequested={handleNewRecordRequested}
      />
      {recordToEdit && (
        <RecordEditDialog
          recordToEdit={recordToEdit}
          setRecordToEdit={setRecordToEdit}
          schema={schema}
          onRecordEditRequested={handleRecordEditRequested}
        />
      )}
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
          onClick={() => onEditButtonClick(params.row)}
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
