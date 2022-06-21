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
  PagingPanel,
  TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import { PopupGroup } from '../../pubups';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import useGroups from '../../hooks/useGroups';
import PopupGroupView from '../../pubups/PopupGroupView';
import { nameLinkFormat } from '../../Shared/colorFormat';

export default function Groups(props: any) {
  const { isRTL, words, menuitem, theme } = props;
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [openItem, setOpenItem] = useState(false);
  const [item, setItem] = useState(null);

  const { groups, refreshgroups, addGroup, editGroup, removeGroup } =
    useGroups();

  const [columns] = useState([
    { name: 'name', title: words.name },
    { name: 'qty', title: words.contacts },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'name', width: 400 },
    { columnName: 'qty', width: 200 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'name', togglingEnabled: false },
    { columnName: 'qty', togglingEnabled: false },
  ]);
  const [pageSizes] = useState([5, 10, 20, 50, 0]);
  const { width, height } = useWindowDimensions();

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeGroup({ variables: { _id } });
      if (res?.data?.deleteGroup?.ok === false) {
        if (res?.data?.deleteGroup?.error.includes('related')) {
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
      refresh={refreshgroups}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#fff',
        }}
      >
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
          <Grid rows={groups} columns={columns} getRowId={getRowId}>
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

            <TableColumnReordering defaultOrder={['name', 'qty']} />
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
              for={['nameAr', 'name']}
              formatterComponent={(props: any) =>
                nameLinkFormat({ ...props, setItem, setOpenItem, isRTL })
              }
            ></DataTypeProvider>
            <TableColumnVisibility />
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
              addAction={addGroup}
              editAction={editGroup}
            >
              <PopupGroup></PopupGroup>
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
        <PopupGroupView
          open={openItem}
          onClose={() => {
            setOpenItem(false);
            setItem(null);
          }}
          isRTL={isRTL}
          theme={theme}
          words={words}
          item={item}
        ></PopupGroupView>
      </Box>
    </PageLayout>
  );
}
