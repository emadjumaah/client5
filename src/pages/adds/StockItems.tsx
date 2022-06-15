/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  Toolbar,
  VirtualTable,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { getRowId } from '../../common';
import {
  currencyFormatter,
  itemTotalFormatter,
} from '../../Shared/colorFormat';
import { SearchTable } from '../../components';
import { useProducts } from '../../hooks';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { Box, Typography } from '@material-ui/core';

export default function StockItems({ isRTL, words }: any) {
  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'quantity', title: words.qty },
    { name: 'unit', title: words.unit },
    { name: 'cost', title: words.cost },
    // { name: 'price', title: words.price },
    { name: 'total', title: words.total },
  ]);

  const { products } = useProducts();
  const { height } = useWindowDimensions();

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
      <Grid
        rows={products.filter((prod: any) => prod.quantity > 0)}
        columns={columns}
        getRowId={getRowId}
      >
        <SortingState />
        <SearchState />

        <IntegratedSorting />
        <IntegratedFiltering />

        <VirtualTable
          height={height - 100}
          messages={{
            noData: isRTL ? 'لا يوجد بيانات' : 'no data',
          }}
          estimatedRowHeight={40}
        />
        <TableHeaderRow
          titleComponent={({ children }) => {
            return (
              <Typography style={{ fontSize: 14, fontWeight: 'bold' }}>
                {children}
              </Typography>
            );
          }}
        />
        <DataTypeProvider
          for={['price', 'cost']}
          formatterComponent={currencyFormatter}
        ></DataTypeProvider>
        <DataTypeProvider
          for={['total']}
          formatterComponent={itemTotalFormatter}
        ></DataTypeProvider>
        <Toolbar />
        <SearchPanel
          inputComponent={(props: any) => {
            return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
          }}
        />
      </Grid>
    </Box>
  );
}
