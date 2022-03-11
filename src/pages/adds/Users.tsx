/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { useState } from 'react';
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
import {
  activeFormatter,
  avatarFormatter,
  rolesFormatter,
} from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import PageLayout from '../main/PageLayout';
import useCompany from '../../hooks/useCompany';
import PopupUserEmail from '../../pubups/PopupUserEmail';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';

const getRowId = (row: { _id: any }) => row._id;

export default function Users({
  isRTL,
  words,
  theme,
  user,
  menuitem,
  isEditor,
}: any) {
  const [loading, setLoading] = useState(false);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [columns] = useState([
    { name: 'avatar', title: words.avatar },
    { name: 'username', title: words.email },
    { name: 'name', title: words.name },
    { name: 'phone', title: words.phoneNumber },
    { name: 'roles', title: words.roles },
    {
      name: isRTL ? 'employeeNameAr' : 'employeeName',
      title: words.employee,
    },
    { name: 'block', title: isRTL ? 'الحالة' : 'Status' },
  ]);

  const {
    users,
    addUser,
    editUser,
    removeUser,
    editPasswordQuick,
    block,
    refreshuser,
  } = useUsers();
  const { company } = useCompany();
  const { employees } = useEmployeesUp();
  const { height } = useWindowDimensions();

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

  const fusers = user.isSuperAdmin
    ? users
    : users.filter((us: any) => !us.isSuperAdmin);

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      isEditor={isEditor}
      theme={theme}
      refresh={refreshuser}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#fff',
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        {loading && <Loading isRTL={isRTL}></Loading>}
        <Grid rows={fusers} columns={columns} getRowId={getRowId}>
          <SortingState />
          <SearchState />

          <EditingState onCommitChanges={commitChanges} />

          <IntegratedSorting />
          <IntegratedFiltering />

          <VirtualTable
            height={height - 100}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={50}
            tableComponent={TableComponent}
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
            <PopupUserEmail
              brch={company?.basename}
              editPassword={editPasswordQuick}
              block={block}
              employees={employees}
            ></PopupUserEmail>
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
      </Box>
    </PageLayout>
  );
}
