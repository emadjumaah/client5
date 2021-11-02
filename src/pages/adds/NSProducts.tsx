/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  Toolbar,
  VirtualTable,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import { currencyFormatter } from '../../Shared/colorFormat';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import { AlertLocal, SearchTable } from '../../components';
import useNoStockProducts from '../../hooks/useNoStockProducts';
import PopupNSProduct from '../../pubups/PopupNSProduct';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export default function NSProducts({ isRTL, words, isEditor, theme }: any) {
  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: isRTL ? 'name' : 'nameAr', title: words.name },
    { name: isRTL ? 'categoryNameAr' : 'categoryName', title: words.category },
    { name: isRTL ? 'brandNameAr' : 'brandName', title: words.brand },
    {
      name: isRTL ? 'departmentNameAr' : 'departmentName',
      title: words.department,
    },
    { name: 'cost', title: words.cost },
    { name: 'price', title: words.price },
  ]);

  const { nsproducts, addnsProduct, editnsProduct, removensProduct } =
    useNoStockProducts();
  const { height } = useWindowDimensions();
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);

      const res = await removensProduct({ variables: { _id } });
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
    <Paper>
      {loading && <Loading isRTL={isRTL}></Loading>}
      <Grid rows={nsproducts} columns={columns} getRowId={getRowId}>
        <SortingState />
        <EditingState onCommitChanges={commitChanges} />
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

        {isEditor && (
          <TableEditColumn
            showEditCommand
            showDeleteCommand
            showAddCommand
            commandComponent={Command}
          ></TableEditColumn>
        )}
        <Toolbar />
        <SearchPanel
          inputComponent={(props: any) => {
            return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
          }}
        />

        <PopupEditing
          theme={theme}
          addAction={addnsProduct}
          editAction={editnsProduct}
        >
          <PopupNSProduct></PopupNSProduct>
        </PopupEditing>
      </Grid>
      {alrt.show && (
        <AlertLocal
          isRTL={isRTL}
          type={alrt?.type}
          msg={alrt?.msg}
          top
        ></AlertLocal>
      )}
    </Paper>
  );
}
