import * as React from "react";
import Records from "./Records";
import { Typography } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { getTableRoute } from "../utils/routes";

function TableRoutes({ groups }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Typography
            style={{ margin: "4em" }}
            variant="body"
            color="text.secondary"
            align="center"
          >
            Nothing selected
          </Typography>
        }
      />
      {groups &&
        Object.keys(groups).map((group) => {
          const tables = groups[group] || [];
          return tables.map((table) => {
            return (
              <Route
                path={getTableRoute(group, table)}
                element={<Records group={group} table={table} />}
              />
            );
          });
        })}
      <Route
        path="*"
        element={
          <Typography
            style={{ margin: "4em" }}
            variant="body"
            color="text.secondary"
            align="center"
          >
            Not found
          </Typography>
        }
      />
    </Routes>
  );
}

export default TableRoutes;
