/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { useState } from 'react';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
  PagingState,
  IntegratedPaging,
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  Toolbar,
  SearchPanel,
  DragDropProvider,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  TableColumnVisibility,
  ColumnChooser,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { errorAlert, Loading, PopupEditing } from '../../Shared';
import { Box, Fab, IconButton, Paper, Typography } from '@material-ui/core';
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
import useEmployees from '../../hooks/useEmployees';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import { getColumns } from '../../common/columns';

const getRowId = (row: { _id: any }) => row._id;

export default function Users({ isRTL, words, theme, user, menuitem }: any) {
  const [loading, setLoading] = useState(false);
  const col = getColumns({ isRTL, words });

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [columns] = useState([
    { name: 'avatar', title: words.avatar },
    { name: 'username', title: words.email },
    col.name,
    { name: 'phone', title: words.phoneNumber },
    { name: 'roles', title: words.roles },
    col.employee,
    { name: 'block', title: isRTL ? 'الحالة' : 'Status' },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'avatar', width: 100 },
    { columnName: 'username', width: 200 },
    { columnName: col.name.name, width: 250 },
    { columnName: 'phone', width: 150 },
    { columnName: 'roles', width: 150 },
    { columnName: col.employee.name, width: 200 },
    { columnName: 'block', width: 100 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'avatar', togglingEnabled: false },
    { columnName: 'username', togglingEnabled: false },
  ]);
  const [pageSizes] = useState([5, 10, 15, 20, 50, 0]);

  const { width, height } = useWindowDimensions();

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
  const { employees } = useEmployees();

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);
      console.log('_id', _id);
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
      theme={theme}
      refresh={refreshuser}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#fff',
        }}
      >
        {loading && <Loading isRTL={isRTL}></Loading>}
        <Paper
          elevation={5}
          style={{
            margin: 40,
            marginTop: 80,
            overflow: 'auto',
            width: width - 330,
            // height: height - 200,
            borderRadius: 10,
          }}
        >
          <Grid rows={fusers} columns={columns} getRowId={getRowId}>
            <SortingState />
            <SearchState />
            <EditingState onCommitChanges={commitChanges} />
            <PagingState defaultCurrentPage={0} defaultPageSize={10} />
            <IntegratedSorting />
            <IntegratedFiltering />
            <IntegratedPaging />
            <DragDropProvider />
            <Table
              messages={{
                noData: isRTL ? 'لا يوجد بيانات' : 'no data',
              }}
              tableComponent={TableComponent}
              rowComponent={(props: any) => (
                <Table.Row {...props} style={{ height: 60 }}></Table.Row>
              )}
              columnExtensions={tableColumnExtensions}
            />

            <TableColumnReordering
              defaultOrder={[
                'avatar',
                'username',
                col.name.name,
                'phone',
                'roles',
                col.employee.name,
                'block',
              ]}
            />
            <TableColumnResizing defaultColumnWidths={tableColumnExtensions} />
            <TableHeaderRow
              showSortingControls
              titleComponent={({ children }) => {
                return (
                  <Typography style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {children}
                  </Typography>
                );
              }}
            />
            <TableColumnVisibility
              columnExtensions={tableColumnVisibilityColumnExtensions}
              defaultHiddenColumnNames={[]}
            />
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
            <ColumnChooser />
            <PagingPanel pageSizes={pageSizes} />
            <SearchPanel
              inputComponent={(props: any) => {
                return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
              }}
            />

            <PopupEditing
              theme={theme}
              addAction={addUser}
              editAction={editUser}
            >
              <PopupUserEmail
                brch={company?.basename}
                editPassword={editPasswordQuick}
                block={block}
                employees={employees}
              ></PopupUserEmail>
            </PopupEditing>
          </Grid>
        </Paper>
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
