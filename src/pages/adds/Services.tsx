/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
  PagingState,
  IntegratedPaging,
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
import { Command, Loading, PopupEditing } from '../../Shared';
import { useServices } from '../../hooks';
import { getRowId } from '../../common';
import { PopupService } from '../../pubups';
import { currencyFormatter, photoFormatter } from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import ImportBtn from '../../common/ImportBtn';
import PopupItemsImport from '../../pubups/PopupItemsImport';
import { getColumns } from '../../common/columns';

export default function Services({ isRTL, words, theme }: any) {
  const [openImport, setOpenImport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [pageSizes] = useState([5, 10, 20, 50, 0]);
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    { name: 'photo', title: ' ' },
    col.name,
    { name: 'price', title: words.price },
    { name: 'unit', title: words.unit },
    { name: 'desc', title: words.description },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'photo', width: 75 },
    { columnName: col.name.name, width: 250 },
    { columnName: 'price', width: 150 },
    { columnName: 'unit', width: 150 },
    { columnName: 'desc', width: 250 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.name.name, togglingEnabled: false },
  ]);

  const { services, addService, addMultiServices, editService, removeService } =
    useServices();

  const { height, width } = useWindowDimensions();
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);
      const res = await removeService({ variables: { _id } });
      if (res?.data?.deleteItem?.ok === false) {
        if (res?.data?.deleteItem?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
      setLoading(false);
    }
  };
  return (
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
      <ImportBtn
        open={() => setOpenImport(true)}
        isRTL={isRTL}
        theme={theme}
      ></ImportBtn>
      <Paper
        elevation={5}
        style={{
          marginTop: 40,
          marginLeft: 40,
          marginRight: 40,
          marginBottom: 30,
          overflow: 'auto',
          width: width - 320,
          borderRadius: 10,
        }}
      >
        <Grid rows={services} columns={columns} getRowId={getRowId}>
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
              <Table.Row {...props} style={{ height: 68 }}></Table.Row>
            )}
            columnExtensions={tableColumnExtensions}
          />
          <TableColumnReordering
            defaultOrder={['photo', 'nameAr', 'price', 'unit', 'desc']}
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
            for={['photo']}
            formatterComponent={photoFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['price']}
            formatterComponent={currencyFormatter}
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
            addAction={addService}
            editAction={editService}
          >
            <PopupService></PopupService>
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
      <PopupItemsImport
        open={openImport}
        onClose={() => setOpenImport(false)}
        addMultiItems={addMultiServices}
        isRTL={isRTL}
        theme={theme}
        words={words}
        itemType={2}
        filename="services"
      ></PopupItemsImport>
    </Box>
  );
}
