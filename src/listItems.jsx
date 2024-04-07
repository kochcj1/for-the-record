import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import "./listitems.css";
import { Avatar, Tooltip } from "@mui/material";

// TODO: tool tips when things are hidden

export const mainListItems = (
  <React.Fragment>
    <ListSubheader className="ellipsis" component="div">
      Project 1
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <Avatar>P</Avatar>
      </ListItemIcon>
      <ListItemText primary="Products" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <Avatar>U</Avatar>
      </ListItemIcon>
      <ListItemText primary="Users" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader className="ellipsis" component="div">
      Project 2
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <Avatar>I</Avatar>
      </ListItemIcon>
      <ListItemText primary="Items" />
    </ListItemButton>
  </React.Fragment>
);
