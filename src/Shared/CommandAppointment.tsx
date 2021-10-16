/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';

import DeleteIcon from '@material-ui/icons/Delete';

import { Box, IconButton, Button, Typography } from '@material-ui/core';
import { getStoreItem } from '../store';
import { roles } from '../common';

const SaveButton = ({ onExecute }: any) => {
  const store = getStoreItem('store');
  const { lang } = store;
  const isCalEditor = roles.isCalEditor();
  if (!isCalEditor) {
    return <div></div>;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Box m={1}>
        <Button
          style={{ width: 85, height: 36 }}
          variant="contained"
          onClick={onExecute}
          color="primary"
        >
          <Typography>{lang === 'ar' ? 'حفظ' : 'Save'}</Typography>
        </Button>
      </Box>
    </div>
  );
};

const CancelButton = () => <div></div>;

const DeleteButton = ({ onExecute }: any) => {
  const store = getStoreItem('store');
  const { lang } = store;
  const isCalEditor = roles.isCalEditor();
  if (!isCalEditor) {
    return <div></div>;
  }

  return (
    <IconButton
      onClick={() => {
        if (
          window.confirm(
            lang === 'ar'
              ? 'هل انت متأكد من حذف الموعد ؟'
              : 'Are you sure you want to delete this row?'
          )
        ) {
          onExecute();
        }
      }}
      title="Delete row"
    >
      <DeleteIcon />
    </IconButton>
  );
};

const commandComponents: any = {
  saveButton: SaveButton,
  deleteButton: DeleteButton,
  cancelButton: CancelButton,
};

const CommandAppointment = ({ id, onExecute }: any) => {
  const CommandButton = commandComponents[id];
  return (
    <Box>
      <CommandButton onExecute={onExecute} />
    </Box>
  );
};

export default CommandAppointment;
