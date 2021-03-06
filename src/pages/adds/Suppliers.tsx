/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  DataTypeProvider,
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  Toolbar,
  SearchPanel,
  TableColumnVisibility,
  DragDropProvider,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  ColumnChooser,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, PopupEditing } from '../../Shared';
import { getRowId, roles } from '../../common';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PopupSupplier from '../../pubups/PopupSupplier';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { getColumns } from '../../common/columns';
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from '../../graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Box, Paper, Typography } from '@material-ui/core';
import PageLayout from '../main/PageLayout';
import { TableComponent } from '../../Shared/TableComponent';
import {
  avataManageFormatter,
  nameManageLinkCustomer,
  purchaseFormatter,
  raseedFormatter,
} from '../../Shared/colorFormat';
import PopupSupplierView from '../../pubups/PopupSupplierView';
import { SupplierContext } from '../../contexts/managment';

export default function Suppliers(props: any) {
  const { isRTL, words, menuitem, theme, company } = props;
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [pageSizes] = useState([5, 8, 10, 20, 50, 0]);
  const [rows, setRows] = useState([]);
  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const { height, width } = useWindowDimensions();

  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };

  const {
    state: { hiddenColumnNames },
    dispatch,
  } = useContext(SupplierContext);
  const setHiddenColumnNames = (hiddenColumns: any) => {
    dispatch({ type: 'setHiddenColumnNames', payload: hiddenColumns });
  };

  const col = getColumns({ isRTL, words });
  const [columns] = useState([
    { name: 'avatar', title: ' ' },
    col.name,
    { name: 'phone', title: words.phoneNumber },
    { name: 'email', title: words.email },
    { name: 'address', title: words.address },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'avatar', width: 150 },
    { columnName: col.name.name, width: 300 },
    { columnName: 'phone', width: 150 },
    { columnName: 'email', width: 200 },
    { columnName: 'address', width: 200 },
  ]);

  const [columnsViewer] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'avatar', title: words.color },
  ]);

  const [loadSuppls, supplsData]: any = useLazyQuery(getSuppliers, {
    fetchPolicy: 'cache-and-network',
  });

  const refresQuery = {
    refetchQueries: [{ query: getSuppliers }],
  };

  useEffect(() => {
    if (openItem) {
      const tsks = supplsData?.data?.['getSuppliers']?.data || [];
      if (tsks && tsks.length > 0) {
        const opened = tsks.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
  }, [supplsData]);

  useEffect(() => {
    loadSuppls({ isRTL });
  }, []);

  const [addSupplier] = useMutation(createSupplier, refresQuery);
  const [editSupplier] = useMutation(updateSupplier, refresQuery);
  const [removeSupplier] = useMutation(deleteSupplier, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeSupplier({ variables: { _id } });
      if (res?.data?.deleteSupplier?.ok === false) {
        if (res?.data?.deleteSupplier?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };

  useEffect(() => {
    if (supplsData?.data?.getSuppliers?.data) {
      const { data } = supplsData.data.getSuppliers;
      const rdata = data.map((d: any) => {
        return {
          ...d,
          raseed:
            d?.totalPurchaseInvoiced -
              d?.totalPurchasePaid -
              d?.totalPurchaseDiscount || 0,
        };
      });
      setRows(rdata);
    }
  }, [supplsData]);

  const refresh = () => {
    supplsData?.refetch();
  };

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refresh}
      loading={supplsData?.loading}
    >
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
            rows={rows}
            columns={roles.isEditor() ? columns : columnsViewer}
            getRowId={getRowId}
          >
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <SearchState />
            <PagingState defaultCurrentPage={0} defaultPageSize={8} />

            <IntegratedSorting />
            <IntegratedFiltering />
            <IntegratedPaging />
            <DragDropProvider />

            <Table
              messages={{
                noData: isRTL ? '???? ???????? ????????????' : 'no data',
              }}
              tableComponent={TableComponent}
              rowComponent={(props: any) => (
                <Table.Row {...props} style={{ height: 80 }}></Table.Row>
              )}
              columnExtensions={tableColumnExtensions}
            />
            <TableColumnReordering
              defaultOrder={[
                'avatar',
                col.name.name,
                'phone',
                'email',
                'address',
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
              defaultHiddenColumnNames={hiddenColumnNames}
              hiddenColumnNames={hiddenColumnNames}
              onHiddenColumnNamesChange={setHiddenColumnNames}
            />
            <DataTypeProvider
              for={['avatar']}
              formatterComponent={(props: any) =>
                avataManageFormatter({
                  ...props,
                  setItem,
                  setOpenItem,
                  isRTL,
                  height: 70,
                })
              }
            ></DataTypeProvider>
            {roles.isEditor() && (
              <DataTypeProvider
                for={[col.name.name]}
                formatterComponent={(props: any) =>
                  nameManageLinkCustomer({
                    ...props,
                    setItem,
                    setOpenItem,
                    isRTL,
                  })
                }
              ></DataTypeProvider>
            )}
            <DataTypeProvider
              for={[col.purchase.name]}
              formatterComponent={(props: any) =>
                purchaseFormatter({ ...props, theme, isRTL, height: 110 })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.raseed.name]}
              formatterComponent={raseedFormatter}
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
              addAction={addSupplier}
              editAction={editSupplier}
            >
              <PopupSupplier></PopupSupplier>
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
        <PopupSupplierView
          open={openItem}
          onClose={onCloseItem}
          row={item}
          theme={theme}
          company={company}
        ></PopupSupplierView>
      </Box>
    </PageLayout>
  );
}
