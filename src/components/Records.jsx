import React, { useState } from "react";
import Title from "./Title";
import Subtitle from "./Subtitle";
import { DataGrid } from "@mui/x-data-grid";
import useRecords from "../hooks/useRecords";
import { SERVER_BASE_URL } from "../utils/env";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import RecordDialog from "./RecordDialog";

// TODO: populate table based on schema and records
// TODO: handle loading and errors (GET and POST errors)

export default function Records({ group, table }) {
  const [open, setOpen] = useState(false);
  const { isLoading, isError, error, isSuccess, data } = useRecords(
    SERVER_BASE_URL,
    group,
    table
  );
  const schema = data?.schema;
  const propertyNames = Object.keys(schema?.properties || {});
  const records = data?.records || [];
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
        setOpen(false);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error posting data:", error);
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
            onClick={() => setOpen(true)}
          >
            Add record
          </Button>
        )}
      </div>
      <Subtitle>{table}</Subtitle>
      {records && records.length > 0 && (
        <React.Fragment>
          <DataGrid
            sx={{ marginTop: "1em" }}
            rowSelection={false}
            columns={propertyNames.map((name) => {
              return { field: name, width: 225 };
            })}
            rows={records.map((record) => {
              const { _id, ...rest } = record;
              return { id: _id, ...rest };
            })}
          />
        </React.Fragment>
      )}
      <RecordDialog
        open={open}
        setOpen={setOpen}
        schema={schema}
        onNewRecordRequested={handleNewRecordRequested}
      />
    </React.Fragment>
  );
}
