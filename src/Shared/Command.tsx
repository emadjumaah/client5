/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';

import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { Box, IconButton, Button } from '@material-ui/core';
import { roles } from '../common';
import { getStoreItem } from '../store';

const AddButton = ({ onExecute }) => {
  const isWriter = roles.isWriter();
  const isEmployee = roles.isEmployee();
  if (!isWriter && !isEmployee) {
    return <div></div>;
  }
  return (
    <Box m={1}>
      <Button
        color="primary"
        variant="contained"
        onClick={onExecute}
        title="Create new row"
        style={{ width: 70 }}
      >
        <AddIcon style={{ fontSize: 26 }} />
      </Button>
    </Box>
  );
};

const EditButton = ({ onExecute }) => {
  const isWriter = roles.isWriter();
  const isEmployee = roles.isEmployee();
  if (!isWriter && !isEmployee) {
    return <div></div>;
  }
  return (
    <IconButton style={{ padding: 8 }} onClick={onExecute} title="Edit row">
      <EditOutlinedIcon style={{ fontSize: 22, color: '#729aaf' }} />
    </IconButton>
  );
};

const DeleteButton = ({ onExecute }) => {
  const store = getStoreItem('store');
  const { lang } = store;
  const isAdmin = roles.isAdmin();
  const isEmployee = roles.isEmployee();
  if (!isAdmin && !isEmployee) {
    return <div></div>;
  }
  return (
    <IconButton
      onClick={() => {
        if (
          window.confirm(
            lang === 'ar'
              ? 'هل انت متأكد من حذف المدخل؟'
              : 'Are you sure you want to delete this row?'
          )
        ) {
          onExecute();
        }
      }}
      title="Delete row"
      style={{ padding: 8 }}
    >
      <DeleteOutlinedIcon style={{ fontSize: 22, color: '#a76f9a' }} />
    </IconButton>
  );
};

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
};

export const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return <CommandButton onExecute={onExecute} />;
};
