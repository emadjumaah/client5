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
  ColumnChooser,
  DragDropProvider,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, PopupEditing } from '../../Shared';
import { getRowId, roles } from '../../common';
import { PopupCustomer } from '../../pubups';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { getColumns } from '../../common/columns';
import {
  appointmentsFormatter,
  avataManageFormatter,
  nameManageLinkFormat,
  raseedFormatter,
  salesFormatter,
} from '../../Shared/colorFormat';
import PopupCustomerView from '../../pubups/PopupCustomerView';
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from '../../graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import PopupCustomerImport from '../../pubups/PopupCustomerImport';
import ImportBtn from '../../common/ImportBtn';
import createMultiCustomers from '../../graphql/mutation/createMultiCustomers';
import { CustomerContext } from '../../contexts/managment';

export default function Customers(props: any) {
  const { isRTL, words, menuitem, theme, company } = props;
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [pageSizes] = useState([5, 10, 20, 50, 0]);
  const [rows, setRows] = useState([]);
  const [item, setItem] = useState(null);
  const [openImport, setOpenImport] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const { height, width } = useWindowDimensions();

  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };

  const {
    state: { hiddenColumnNames },
    dispatch,
  } = useContext(CustomerContext);
  const setHiddenColumnNames = (hiddenColumns: any) => {
    dispatch({ type: 'setHiddenColumnNames', payload: hiddenColumns });
  };

  const col = getColumns({ isRTL, words });
  const [columns] = useState([
    { name: 'avatar', title: ' ' },
    col.name,
    col.appointments,
    col.sales,
    col.raseed,
    { name: 'phone', title: words.phoneNumber },
    { name: 'email', title: words.email },
    { name: 'address', title: words.address },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'avatar', width: 150 },
    { columnName: col.name.name, width: 300 },
    { columnName: col.appointments.name, width: 300 },
    { columnName: col.sales.name, width: 300 },
    { columnName: col.raseed.name, width: 200 },
    { columnName: 'phone', width: 150 },
    { columnName: 'email', width: 200 },
    { columnName: 'address', width: 200 },
  ]);

  const [columnsViewer] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'avatar', title: words.color },
  ]);

  const [loadCusts, custssData]: any = useLazyQuery(getCustomers, {
    fetchPolicy: 'cache-and-network',
  });

  const refresQuery = {
    refetchQueries: [{ query: getCustomers }],
  };
  useEffect(() => {
    if (openItem) {
      const tsks = custssData?.data?.['getCustomers']?.data || [];
      if (tsks && tsks.length > 0) {
        const opened = tsks.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
  }, [custssData]);

  useEffect(() => {
    loadCusts({ isRTL });
  }, []);

  const [addCustomer] = useMutation(createCustomer, refresQuery);
  const [addMultiCustomers] = useMutation(createMultiCustomers, refresQuery);
  const [editCustomer] = useMutation(updateCustomer, refresQuery);
  const [removeCustomer] = useMutation(deleteCustomer, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeCustomer({ variables: { _id } });
      if (res?.data?.deleteCustomer?.ok === false) {
        if (res?.data?.deleteCustomer?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };

  useEffect(() => {
    if (custssData?.data?.getCustomers?.data) {
      const { data } = custssData.data.getCustomers;
      const rdata = data.map((d: any) => {
        return {
          ...d,
          raseed: d?.totalinvoiced - d?.totalpaid - d?.totalDiscount || 0,
        };
      });
      setRows(rdata);
    }
  }, [custssData]);

  const refresh = () => {
    custssData?.refetch();
  };
  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refresh}
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
          <Grid
            rows={rows}
            columns={roles.isEditor() ? columns : columnsViewer}
            getRowId={getRowId}
          >
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <SearchState />
            <PagingState defaultCurrentPage={0} defaultPageSize={5} />

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
                <Table.Row {...props} style={{ height: 130 }}></Table.Row>
              )}
              columnExtensions={tableColumnExtensions}
            />
            <TableColumnReordering
              defaultOrder={[
                'avatar',
                col.name.name,
                col.appointments.name,
                col.sales.name,
                col.raseed.name,
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
                  height: 110,
                })
              }
            ></DataTypeProvider>
            {roles.isEditor() && (
              <DataTypeProvider
                for={[col.name.name]}
                formatterComponent={(props: any) =>
                  nameManageLinkFormat({
                    ...props,
                    setItem,
                    setOpenItem,
                    isRTL,
                  })
                }
              ></DataTypeProvider>
            )}
            <DataTypeProvider
              for={[col.appointments.name]}
              formatterComponent={(props: any) =>
                appointmentsFormatter({ ...props, theme, isRTL, height: 110 })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.sales.name]}
              formatterComponent={(props: any) =>
                salesFormatter({ ...props, theme, isRTL, height: 110 })
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
              addAction={addCustomer}
              editAction={editCustomer}
            >
              <PopupCustomer></PopupCustomer>
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
        <PopupCustomerView
          open={openItem}
          onClose={onCloseItem}
          row={item}
          theme={theme}
          company={company}
        ></PopupCustomerView>
        <PopupCustomerImport
          open={openImport}
          onClose={() => setOpenImport(false)}
          addMultiItems={addMultiCustomers}
          isRTL={isRTL}
          theme={theme}
          words={words}
        ></PopupCustomerImport>
      </Box>
    </PageLayout>
  );
}
