/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
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
import { currencyFormatter } from '../../Shared/colorFormat';
import { SearchTable } from '../../components';
import { useProducts } from '../../hooks';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export default function StockItems({ isRTL, words }: any) {
  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    // { name: isRTL ? "name" : "nameAr", title: words.name },
    { name: isRTL ? 'categoryNameAr' : 'categoryName', title: words.category },
    { name: isRTL ? 'brandNameAr' : 'brandName', title: words.brand },
    { name: 'qty', title: words.qty },
    { name: 'cost', title: words.cost },
    { name: 'price', title: words.price },
  ]);

  const { stockItems } = useProducts();
  const { height } = useWindowDimensions();
  return (
    <Paper>
      <Grid rows={stockItems} columns={columns} getRowId={getRowId}>
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
        <TableHeaderRow showSortingControls />
        <DataTypeProvider
          for={['price', 'cost']}
          formatterComponent={currencyFormatter}
        ></DataTypeProvider>

        <Toolbar />
        <SearchPanel
          inputComponent={(props: any) => {
            return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
          }}
        />
      </Grid>
    </Paper>
  );
}
