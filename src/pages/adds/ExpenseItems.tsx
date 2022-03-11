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
  VirtualTable,
  Toolbar,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '../../Shared';
import { useExpenseItems } from '../../hooks';
import { getRowId } from '../../common';
import { PopupExpenseItem } from '../../pubups';
import { currencyFormatter } from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import { Box } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import ImportBtn from '../../common/ImportBtn';
import PopupExpenseItemImport from '../../pubups/PopupExpenseItemImport';

export default function ExpenseItems({ isRTL, words, theme, isEditor }: any) {
  const [openImport, setOpenImport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    // { name: 'price', title: words.price },
    { name: 'desc', title: words.description },
    // { name: 'unit', title: words.unit },
  ]);

  const {
    expenseItems,
    addExpenseItem,
    addMultiExpenseItems,
    editExpenseItem,
    removeExpenseItem,
  } = useExpenseItems();
  const { height } = useWindowDimensions();
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);

      const res = await removeExpenseItem({ variables: { _id } });
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
      <Grid rows={expenseItems} columns={columns} getRowId={getRowId}>
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
          tableComponent={TableComponent}
        />
        <TableHeaderRow showSortingControls />

        <DataTypeProvider
          for={['price']}
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
          addAction={addExpenseItem}
          editAction={editExpenseItem}
        >
          <PopupExpenseItem></PopupExpenseItem>
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
      <PopupExpenseItemImport
        open={openImport}
        onClose={() => setOpenImport(false)}
        addMultiItems={addMultiExpenseItems}
        isRTL={isRTL}
        theme={theme}
        words={words}
      ></PopupExpenseItemImport>
    </Box>
  );
}
