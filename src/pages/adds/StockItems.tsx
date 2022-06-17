/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import {
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
import { getRowId } from '../../common';
import {
  currencyFormatter,
  itemTotalFormatter,
  photoFormatter,
} from '../../Shared/colorFormat';
import { SearchTable } from '../../components';
import { useProducts } from '../../hooks';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { Box, Paper, Typography } from '@material-ui/core';
import { getColumns } from '../../common/columns';
import { TableComponent } from '../../Shared/TableComponent';

export default function StockItems({ isRTL, words }: any) {
  const col = getColumns({ isRTL, words });
  const [pageSizes] = useState([5, 10, 20, 50, 0]);

  const [columns] = useState([
    { name: 'photo', title: ' ' },
    col.name,
    { name: 'quantity', title: words.qty },
    { name: 'cost', title: words.cost },
    { name: 'price', title: words.price },
    { name: 'unit', title: words.unit },
    { name: 'desc', title: words.description },
    { name: 'total', title: words.total },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'photo', width: 100 },
    { columnName: col.name.name, width: 250 },
    { columnName: 'quantity', width: 150 },
    { columnName: 'cost', width: 150 },
    { columnName: 'price', width: 150 },
    { columnName: 'unit', width: 150 },
    { columnName: 'desc', width: 250 },
    { columnName: 'total', width: 150 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: col.name.name, togglingEnabled: false },
  ]);

  const { products } = useProducts();
  const { height, width } = useWindowDimensions();

  return (
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
          marginTop: 40,
          marginLeft: 40,
          marginRight: 40,
          marginBottom: 30,
          overflow: 'auto',
          width: width - 320,
          borderRadius: 10,
        }}
      >
        <Grid
          rows={products.filter((prod: any) => prod.quantity > 0)}
          columns={columns}
          getRowId={getRowId}
        >
          <SortingState />
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
              'total',
            ]}
          />
          <TableColumnResizing defaultColumnWidths={tableColumnExtensions} />
          <TableHeaderRow
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
            defaultHiddenColumnNames={['price']}
          />
          <DataTypeProvider
            for={['price', 'cost', 'total']}
            formatterComponent={currencyFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['total']}
            formatterComponent={itemTotalFormatter}
          ></DataTypeProvider>{' '}
          <DataTypeProvider
            for={['photo']}
            formatterComponent={photoFormatter}
          ></DataTypeProvider>
          <Toolbar />
          <ColumnChooser />
          <PagingPanel pageSizes={pageSizes} />
          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />
        </Grid>
      </Paper>
    </Box>
  );
}
