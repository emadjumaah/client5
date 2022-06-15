import React from 'react';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
  Toolbar,
  SearchPanel,
  TableColumnVisibility,
  ColumnChooser,
} from '@devexpress/dx-react-grid-material-ui';
import {
  currencyFormatterEmpty,
  dueAmountFormatter,
  incomeAmountFormatter,
  nameLinkFormat,
  progressFormatter,
} from '../../Shared/colorFormat';
import { TableComponent } from '../../Shared/TableComponent';
import { getRowId, roles } from '../../common';
import { Command, PopupEditing } from '../../Shared';
import SearchTable from '../filters/SearchTable';
import { PopupCustomer } from '../../pubups';
import { Typography } from '@material-ui/core';

export default function CustomersTable({
  rows,
  columns,
  columnsViewer,
  commitChanges,
  height,
  isRTL,
  setItem,
  setOpenItem,
  theme,
  addCustomer,
  editCustomer,
}: any) {
  return (
    <Grid
      rows={rows}
      columns={roles.isEditor() ? columns : columnsViewer}
      getRowId={getRowId}
    >
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
        estimatedRowHeight={40}
        tableComponent={TableComponent}
      />
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
        defaultHiddenColumnNames={[
          'amount',
          'progress',
          'totalinvoiced',
          'totalpaid',
          'due',
          'toatlExpenses',
          'income',
        ]}
      />
      {roles.isEditor() && (
        <DataTypeProvider
          for={['nameAr', 'name']}
          formatterComponent={(props: any) =>
            nameLinkFormat({ ...props, setItem, setOpenItem, isRTL })
          }
        ></DataTypeProvider>
      )}
      <DataTypeProvider
        for={['amount', 'toatlExpenses', 'totalpaid', 'totalinvoiced']}
        formatterComponent={currencyFormatterEmpty}
      ></DataTypeProvider>
      <DataTypeProvider
        for={['due']}
        formatterComponent={dueAmountFormatter}
      ></DataTypeProvider>
      <DataTypeProvider
        for={['income']}
        formatterComponent={incomeAmountFormatter}
      ></DataTypeProvider>
      <DataTypeProvider
        for={['progress']}
        formatterComponent={progressFormatter}
      ></DataTypeProvider>
      <TableEditColumn
        showEditCommand
        showDeleteCommand
        showAddCommand
        commandComponent={Command}
      ></TableEditColumn>
      <Toolbar />
      <ColumnChooser />
      <SearchPanel
        inputComponent={(props: any) => {
          return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
        }}
      />
      <PopupEditing
        theme={theme}
        addAction={addCustomer}
        editAction={editCustomer}
      >
        <PopupCustomer></PopupCustomer>
      </PopupEditing>
    </Grid>
  );
}
