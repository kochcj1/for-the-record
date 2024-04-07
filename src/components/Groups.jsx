import * as React from "react";
import List from "@mui/material/List";
import { Avatar } from "@mui/material";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import { useNavigate } from "react-router-dom";
import { getTableRoute } from "../utils/routes";
import "../styles/groups.css";

// TODO: handle loading and errors

function Groups({ isLoading, isError, error, isSuccess, groups }) {
  const navigate = useNavigate();
  const handleTableClick = (group, table) => {
    navigate(getTableRoute(group, table));
  };

  return (
    <List component="nav">
      {isSuccess &&
        Object.keys(groups).map((group, index) => {
          const tables = groups[group] || [];
          return (
            <React.Fragment key={group}>
              <ListSubheader className="ellipsis" component="div">
                {group}
              </ListSubheader>
              {tables.map((table) => {
                return (
                  <ListItemButton
                    key={table}
                    onClick={() => handleTableClick(group, table)}
                  >
                    <ListItemIcon>
                      <Avatar>{table.charAt(0)}</Avatar>
                    </ListItemIcon>
                    <ListItemText primary={table} />
                  </ListItemButton>
                );
              })}
              {index !== Object.keys(groups).length - 1 && (
                <Divider sx={{ my: 1 }} />
              )}
            </React.Fragment>
          );
        })}
    </List>
  );
}

export default Groups;
