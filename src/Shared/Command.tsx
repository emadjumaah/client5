/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';

import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { Box, IconButton, Fab } from '@material-ui/core';
import { roles } from '../common';
import { getStoreItem } from '../store';

const AddButton = ({ onExecute }) => {
  const isWriter = roles.isWriter();
  const isEmployee = roles.isEmployee();
  if (!isWriter && !isEmployee) {
    return <div></div>;
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <Box m={1}>
        <Fab color="primary" onClick={onExecute} title="Create new row">
          <AddIcon style={{ fontSize: 26 }} />
        </Fab>
      </Box>
    </div>
  );
};

const EditButton = ({ onExecute }) => {
  const isEditor = roles.isEditor();
  const isEmployee = roles.isEmployee();
  if (!isEditor && !isEmployee) {
    return <div></div>;
  }
  return (
    <IconButton
      style={{ padding: 5, marginTop: 3, marginBottom: 3 }}
      onClick={onExecute}
      title="Edit row"
    >
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
      style={{ padding: 5 }}
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
