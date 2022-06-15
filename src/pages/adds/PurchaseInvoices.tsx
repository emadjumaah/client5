/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
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
import { getRowId, updateDocNumbers } from '../../common';
import {
  getPurchaseInvoices,
  createPurchaseInvoice,
  updatePurchaseInvoice,
  deletePurchaseInvoice,
  getLastNos,
  getSuppliers,
  getEmployees,
  getResourses,
  getProjects,
  getDepartments,
  getProducts,
} from '../../graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  amountFormatter,
  currencyFormatter,
  timeFormatter,
} from '../../Shared/colorFormat';
import { getColumns } from '../../common/columns';
import { PurchaseContext } from '../../contexts';
import PageLayout from '../main/PageLayout';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import { SearchTable } from '../../components';
import PopupPurchaseInvoice from '../../pubups/PopupPurchaseInvoice';
import { useProducts, useTemplate } from '../../hooks';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useResoursesUp from '../../hooks/useResoursesUp';
import useTasks from '../../hooks/useTasks';
import getTasks from '../../graphql/query/getTasks';
import { Box, Typography } from '@material-ui/core';
import { TableComponent } from '../../Shared/ItemsTable';

export default function PurchaseInvoices({
  isRTL,
  words,
  menuitem,
  theme,
  company,
}: any) {
  const col = getColumns({ isRTL, words });

  const { tempoptions } = useTemplate();

  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          { name: 'time', title: words.time },
          { name: 'docNo', title: words.no },
          col.supplier,
          { name: 'supplierPhone', title: words.phoneNumber },
          { name: 'total', title: words.total },
          { name: 'discount', title: words.discount },
          { name: 'amount', title: words.amount },
        ]
      : [
          { name: 'time', title: words.time },
          { name: 'docNo', title: words.no },
          col.taskId,
          col.supplier,
          { name: 'supplierPhone', title: words.phoneNumber },
          { name: 'total', title: words.total },
          { name: 'discount', title: words.discount },
          { name: 'amount', title: words.amount },
        ]
  );

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const { tasks } = useTasks();

  const { height } = useWindowDimensions();

  const { products } = useProducts();
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();

  const {
    state: { currentDate, currentViewName, endDate, sort },
    dispatch,
  } = useContext(PurchaseContext);

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };

  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const [loadPurchaseInvoices, opData]: any = useLazyQuery(getPurchaseInvoices);

  const refresQuery = {
    refetchQueries: [
      {
        query: getPurchaseInvoices,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
      },

      {
        query: getLastNos,
      },
      {
        query: getTasks,
      },
      {
        query: getSuppliers,
      },
      {
        query: getProducts,
        variables: { isRTL },
      },
      {
        query: getEmployees,
        variables: { isRTL, resType: 1 },
      },
      {
        query: getDepartments,
        variables: { isRTL, depType: 1 },
      },
      {
        query: getResourses,
        variables: { isRTL, resType: 1 },
      },
      {
        query: getProjects,
      },
    ],
  };

  useEffect(() => {
    const variables = {
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadPurchaseInvoices({
      variables,
    });
  }, [start, end]);

  const [addPurchaseInvoice] = useMutation(createPurchaseInvoice, refresQuery);
  const [editPurchaseInvoice] = useMutation(updatePurchaseInvoice, refresQuery);
  const [removePurchaseInvoice] = useMutation(
    deletePurchaseInvoice,
    refresQuery
  );

  const commitChanges: any = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      removePurchaseInvoice({ variables: { _id } });
      setRows(rows.filter((row: any) => row._id !== _id));
    }
  };

  useEffect(() => {
    if (opData?.loading) {
      setLoading(true);
    }
    if (opData?.data?.getPurchaseInvoices?.data) {
      const { data } = opData.data.getPurchaseInvoices;
      const rdata = updateDocNumbers(data);
      setRows(rdata);
      setLoading(false);
    }
  }, [opData]);

  const refresh = () => {
    opData?.refetch();
  };

  const setSortDispatch = (value: any) => {
    dispatch({ type: 'setSort', payload: value });
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
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <Box
          display="flex"
          style={{
            position: 'absolute',
            zIndex: 111,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <DateNavigatorReports
            setStart={setStart}
            setEnd={setEnd}
            currentDate={currentDate}
            currentDateChange={currentDateChange}
            currentViewName={currentViewName}
            currentViewNameChange={currentViewNameChange}
            endDate={endDate}
            endDateChange={endDateChange}
            views={[1, 7, 30, 365, 1000]}
            isRTL={isRTL}
            words={words}
            theme={theme}
          ></DateNavigatorReports>
        </Box>

        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState
            defaultSorting={sort}
            onSortingChange={(srt: any) => setSortDispatch(srt)}
          />
          <EditingState onCommitChanges={commitChanges} />
          <SearchState />
          <IntegratedSorting />
          <IntegratedFiltering />
          <VirtualTable
            height={window.innerHeight - 133}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={40}
            tableComponent={TableComponent}
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
            for={['time']}
            formatterComponent={timeFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['amount']}
            formatterComponent={amountFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['total', 'discount']}
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
            addAction={addPurchaseInvoice}
            editAction={editPurchaseInvoice}
          >
            <PopupPurchaseInvoice
              resourses={resourses}
              employees={employees}
              departments={departments}
              company={company}
              servicesproducts={products}
              tasks={tasks}
            ></PopupPurchaseInvoice>
          </PopupEditing>
        </Grid>
        {loading && <Loading isRTL={isRTL} />}
      </Box>
    </PageLayout>
  );
}
