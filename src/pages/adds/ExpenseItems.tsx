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
import { Command, PopupEditing } from '../../Shared';
import { useExpenseItems } from '../../hooks';
import { getRowId } from '../../common';
import { PopupExpenseItem } from '../../pubups';
import { currencyFormatter, isSalaryFormatter } from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import ImportBtn from '../../common/ImportBtn';
import PopupItemsImport from '../../pubups/PopupItemsImport';
import { getColumns } from '../../common/columns';
import PageLayout from '../main/PageLayout';

export default function ExpenseItems({
  isRTL,
  words,
  theme,
  tempId,
  menuitem,
}: any) {
  const [openImport, setOpenImport] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [pageSizes] = useState([5, 10, 15, 20, 50, 0]);

  const col = getColumns({ isRTL, words });
  const isDel = tempId === 9;
  const [columns] = useState(
    isDel
      ? [
          col.name,
          { name: 'price', title: words.price },
          { name: 'unit', title: words.unit },
          {
            name: 'isSalary',
            title: isRTL ? 'مستقطع الراتب' : 'Salary Deduction',
          },
          { name: 'desc', title: words.description },
        ]
      : [
          col.name,
          { name: 'price', title: words.price },
          { name: 'unit', title: words.unit },
          { name: 'desc', title: words.description },
        ]
  );

  const [tableColumnExtensions]: any = useState([
    { columnName: col.name.name, width: 250 },
    { columnName: 'price', width: 150 },
    { columnName: 'unit', width: 150 },
    { columnName: 'isSalary', width: 150 },
    { columnName: 'desc', width: 250 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.name.name, togglingEnabled: false },
  ]);

  const {
    expenseItems,
    addExpenseItem,
    addMultiExpenseItems,
    editExpenseItem,
    removeExpenseItem,
    refreshexpitems,
    loading,
  } = useExpenseItems();
  const { height, width } = useWindowDimensions();
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];

      const res = await removeExpenseItem({ variables: { _id } });
      if (res?.data?.deleteItem?.ok === false) {
        if (res?.data?.deleteItem?.error.includes('related')) {
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
      refresh={refreshexpitems}
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
          <Grid rows={expenseItems} columns={columns} getRowId={getRowId}>
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <SearchState />
            <PagingState defaultCurrentPage={0} defaultPageSize={15} />
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
                <Table.Row {...props} style={{ height: 45 }}></Table.Row>
              )}
              columnExtensions={tableColumnExtensions}
            />
            <TableColumnReordering
              defaultOrder={[
                'photo',
                'nameAr',
                'price',
                'unit',
                'isSalary',
                'desc',
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
              for={['price']}
              formatterComponent={currencyFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['isSalary']}
              formatterComponent={(props: any) =>
                isSalaryFormatter({ ...props, editAction: editExpenseItem })
              }
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
              addAction={addExpenseItem}
              editAction={editExpenseItem}
            >
              <PopupExpenseItem></PopupExpenseItem>
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
          addMultiItems={addMultiExpenseItems}
          isRTL={isRTL}
          theme={theme}
          words={words}
          itemType={10}
          filename="expenses"
        ></PopupItemsImport>
      </Box>
    </PageLayout>
  );
}
