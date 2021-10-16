/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
  Toolbar,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { errorAlert, Loading, PopupEditing } from '../../Shared';
import { Box, Fab, IconButton } from '@material-ui/core';
import { useUsers } from '../../hooks';
import PopupUser from '../../pubups/PopupUser';
import {
  activeFormatter,
  avatarFormatter,
  rolesFormatter,
} from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import PageLayout from '../main/PageLayout';
import useCompany from '../../hooks/useCompany';
import React from 'react';

const getRowId = (row: { _id: any }) => row._id;

export default function Users({
  isRTL,
  words,
  theme,
  menuitem,
  isEditor,
}: any) {
  const [loading, setLoading] = useState(false);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [columns] = useState([
    { name: 'avatar', title: words.avatar },
    { name: 'username', title: words.username },
    { name: 'name', title: words.name },
    { name: 'phone', title: words.phoneNumber },
    { name: 'email', title: words.email },
    { name: 'roles', title: words.roles },
    { name: 'block', title: isRTL ? 'الحالة' : 'Status' },
  ]);

  const {
    users,
    addUser,
    editUser,
    removeUser,
    editPassword,
    block,
    refreshuser,
  } = useUsers();
  const { company } = useCompany();
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);

      const res = await removeUser({ variables: { _id } });
      if (res?.data?.deleteUser?.ok === false) {
        await errorAlert(setAlrt, isRTL);
        return;
      }
      setLoading(false);
    }
  };

  const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: 'center' }}>
      <Box m={1}>
        <Fab color="primary" onClick={onExecute} title="Create new row">
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );

  const EditButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Edit row">
      <EditIcon />
    </IconButton>
  );

  const DeleteButton = ({ onExecute }) => (
    <IconButton
      onClick={() => {
        if (window.confirm('Are you sure you want to delete this row?')) {
          onExecute();
        }
      }}
      title="Delete row"
    >
      <DeleteIcon />
    </IconButton>
  );

  const commandComponents = {
    add: AddButton,
    edit: EditButton,
    delete: DeleteButton,
  };

  const Command = ({ id, onExecute }) => {
    const CommandButton = commandComponents[id];
    return <CommandButton onExecute={onExecute} />;
  };

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      isEditor={isEditor}
      theme={theme}
      refresh={refreshuser}
    >
      <Paper>
        {loading && <Loading isRTL={isRTL}></Loading>}
        <Grid rows={users} columns={columns} getRowId={getRowId}>
          <SortingState />
          <SearchState />

          <EditingState onCommitChanges={commitChanges} />

          <IntegratedSorting />
          <IntegratedFiltering />

          <VirtualTable
            height={window.innerHeight - 133}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={40}
          />
          <TableHeaderRow showSortingControls />
          <DataTypeProvider
            for={['roles']}
            formatterComponent={(props: any) =>
              rolesFormatter({ ...props, isRTL })
            }
          ></DataTypeProvider>
          <DataTypeProvider
            for={['avatar']}
            formatterComponent={avatarFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['block']}
            formatterComponent={activeFormatter}
          ></DataTypeProvider>

          <TableEditColumn
            showEditCommand
            showDeleteCommand
            showAddCommand
            commandComponent={Command}
          ></TableEditColumn>
          <Toolbar />
          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />

          <PopupEditing theme={theme} addAction={addUser} editAction={editUser}>
            <PopupUser
              brch={company?.basename}
              editPassword={editPassword}
              block={block}
            ></PopupUser>
          </PopupEditing>
        </Grid>
        {alrt.show && (
          <AlertLocal
            isRTL={isRTL}
            type={alrt?.type}
            msg={alrt?.msg}
            top
          ></AlertLocal>
        )}
      </Paper>
    </PageLayout>
  );
}
