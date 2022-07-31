/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  DataTypeProvider,
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  Toolbar,
  SearchPanel,
  TableColumnVisibility,
  ColumnChooser,
  DragDropProvider,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import { PopupContact } from '../../pubups';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import ImportBtn from '../../common/ImportBtn';
import useContacts from '../../hooks/useContacts';
import PopupContactImport from '../../pubups/PopupContactImport';
import useGroups from '../../hooks/useGroups';
import { avatarFormatter, groupFormatter } from '../../Shared/colorFormat';
import ImportBtns from '../../common/ImportBtns';

export default function Contacts(props: any) {
  const { isRTL, words, menuitem, theme } = props;
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [openImport, setOpenImport] = useState(false);
  const {
    contacts,
    refreshcontact,
    addContact,
    addMultiContacts,
    editContact,
    removeContact,
    syncCust,
    syncEmpl,
    loading,
  } = useContacts();
  const { groups } = useGroups();
  const [columns] = useState([
    { name: 'avatar', title: ' ' },
    { name: 'name', title: words.name },
    { name: 'phone', title: words.phoneNumber },
    { name: 'groupIds', title: isRTL ? 'المجموعات' : 'Groups' },
    { name: 'email', title: words.email },
    { name: 'company', title: words.companyName },
    { name: 'address', title: words.address },
    { name: 'notes', title: words.notes },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'avatar', width: 100 },
    { columnName: 'name', width: 200 },
    { columnName: 'phone', width: 150 },
    { columnName: 'groupIds', width: 200 },
    { columnName: 'email', width: 200 },
    { columnName: 'company', width: 200 },
    { columnName: 'address', width: 200 },
    { columnName: 'notes', width: 200 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'avatar', togglingEnabled: false },
    { columnName: 'name', togglingEnabled: false },
  ]);
  const [pageSizes] = useState([5, 10, 20, 50, 0]);
  const { width, height } = useWindowDimensions();

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeContact({ variables: { _id } });
      if (res?.data?.deleteContact?.ok === false) {
        if (res?.data?.deleteContact?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refreshcontact}
      loading={loading}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#fff',
        }}
      >
        <ImportBtn
          open={() => setOpenImport(true)}
          isRTL={isRTL}
          theme={theme}
        ></ImportBtn>
        <ImportBtns
          isRTL={isRTL}
          theme={theme}
          syncCust={syncCust}
          syncEmpl={syncEmpl}
        ></ImportBtns>
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
          <Grid rows={contacts} columns={columns} getRowId={getRowId}>
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <SearchState />
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
                'name',
                'phone',
                'groupIds',
                'email',
                'company',
                'address',
                'notes',
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
              defaultHiddenColumnNames={['address', 'notes']}
            />
            <DataTypeProvider
              for={['groupIds']}
              formatterComponent={(props) =>
                groupFormatter(props, groups, isRTL)
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={['avatar']}
              formatterComponent={avatarFormatter}
            ></DataTypeProvider>
            <TableColumnVisibility
              defaultHiddenColumnNames={['address', 'notes']}
            />
            <TableEditColumn
              showEditCommand
              showDeleteCommand
              showAddCommand
              commandComponent={Command}
            ></TableEditColumn>
            <Toolbar />
            <ColumnChooser />
            <PagingPanel pageSizes={pageSizes} />
            <ColumnChooser />
            <SearchPanel
              inputComponent={(props: any) => {
                return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
              }}
            />
            <PopupEditing
              theme={theme}
              addAction={addContact}
              editAction={editContact}
            >
              <PopupContact></PopupContact>
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
        <PopupContactImport
          open={openImport}
          onClose={() => setOpenImport(false)}
          addMultiItems={addMultiContacts}
          isRTL={isRTL}
          theme={theme}
          words={words}
        ></PopupContactImport>
      </Box>
    </PageLayout>
  );
}
