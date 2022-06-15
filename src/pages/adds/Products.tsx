/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
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
import { PopupProduct } from '../../pubups';
import { currencyFormatter } from '../../Shared/colorFormat';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import { AlertLocal, SearchTable } from '../../components';
import { useProducts } from '../../hooks';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import PopupItemsImport from '../../pubups/PopupItemsImport';
import { Box, Typography } from '@material-ui/core';
import ImportBtn from '../../common/ImportBtn';

export default function Products({ isRTL, words, theme }: any) {
  const [loading, setLoading] = useState(false);
  const [openImport, setOpenImport] = useState(false);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'cost', title: words.cost },
    { name: 'price', title: words.price },
    { name: 'quantity', title: words.qty },
    { name: 'desc', title: words.description },
    { name: 'unit', title: words.unit },
  ]);

  const { products, addProduct, addMultiProducts, editProduct, removeProduct } =
    useProducts();
  const { height } = useWindowDimensions();
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);
      const res = await removeProduct({ variables: { _id } });
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
      <Grid rows={products} columns={columns} getRowId={getRowId}>
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
        <DataTypeProvider
          for={['price', 'cost']}
          formatterComponent={currencyFormatter}
        ></DataTypeProvider>

        <TableEditColumn
          showEditCommand
          showDeleteCommand
          showAddCommand
          commandComponent={Command}
        ></TableEditColumn>
        <Toolbar />
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
  );
}
