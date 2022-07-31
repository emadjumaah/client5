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
  ColumnChooser,
  PagingPanel,
  TableColumnVisibility,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import { PopupProduct } from '../../pubups';
import { currencyFormatter, photoFormatter } from '../../Shared/colorFormat';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import { AlertLocal, SearchTable } from '../../components';
import { useProducts } from '../../hooks';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import PopupItemsImport from '../../pubups/PopupItemsImport';
import { Box, Paper, Typography } from '@material-ui/core';
import ImportBtn from '../../common/ImportBtn';
import { getColumns } from '../../common/columns';
import { TableComponent } from '../../Shared/TableComponent';
import PageLayout from '../main/PageLayout';

export default function Products({ isRTL, words, theme, menuitem }: any) {
  const [openImport, setOpenImport] = useState(false);
  const [pageSizes] = useState([5, 10, 20, 50, 0]);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    { name: 'photo', title: ' ' },
    col.name,
    { name: 'quantity', title: words.qty },
    { name: 'cost', title: words.cost },
    { name: 'price', title: words.price },
    { name: 'unit', title: words.unit },
    { name: 'desc', title: words.description },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'photo', width: 75 },
    { columnName: col.name.name, width: 250 },
    { columnName: 'quantity', width: 150 },
    { columnName: 'cost', width: 150 },
    { columnName: 'price', width: 150 },
    { columnName: 'unit', width: 150 },
    { columnName: 'desc', width: 250 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.name.name, togglingEnabled: false },
  ]);

  const {
    products,
    addProduct,
    addMultiProducts,
    editProduct,
    removeProduct,
    refreshproduct,
    loading,
  } = useProducts();
  const { height, width } = useWindowDimensions();
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeProduct({ variables: { _id } });
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
      refresh={refreshproduct}
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
          <Grid rows={products} columns={columns} getRowId={getRowId}>
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
              defaultOrder={[
                'photo',
                'nameAr',
                'quantity',
                'cost',
                'price',
                'unit',
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
              for={['price', 'cost']}
              formatterComponent={currencyFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['photo']}
              formatterComponent={photoFormatter}
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
              addAction={addProduct}
              editAction={editProduct}
            >
              <PopupProduct></PopupProduct>
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
          addMultiItems={addMultiProducts}
          isRTL={isRTL}
          theme={theme}
          words={words}
          itemType={1}
          filename="products"
        ></PopupItemsImport>
      </Box>
    </PageLayout>
  );
}
