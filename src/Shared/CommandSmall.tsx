/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";

import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import { Box, IconButton, Fab } from "@material-ui/core";

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: "center" }}>
    <Box m={1}>
      <Fab color="primary" onClick={onExecute} title="Create new row">
        <AddIcon />
      </Fab>
    </Box>
  </div>
);

const EditButton = ({ onExecute }) => (
  <IconButton
    onClick={onExecute}
    style={{ height: 30, width: 30 }}
    title="Edit row"
  >
    <EditIcon style={{ fontSize: 22, color: "#aaa" }} />
  </IconButton>
);

const DeleteButton = ({ onExecute }) => (
  <IconButton
    onClick={onExecute}
    style={{ height: 30, width: 30 }}
    title="Delete row"
  >
    <DeleteIcon style={{ fontSize: 22, color: "#aaa" }} />
  </IconButton>
);

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
};

export const CommandSmall = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return <CommandButton onExecute={onExecute} />;
};
