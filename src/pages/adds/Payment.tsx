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
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  SearchPanel,
  Toolbar,
  DragDropProvider,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  TableColumnVisibility,
  ColumnChooser,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '../../Shared';
import { getRowId, updateDocNumbers } from '../../common';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  createFinance,
  deleteFinance,
  getDepartments,
  getEmployees,
  getLastNos,
  getProjects,
  getResourses,
  getSuppliers,
  updateFinance,
} from '../../graphql';
import {
  accountFormatter,
  currencyFormatter,
  customerAccountFormatter,
  samllFormatter,
  timeFormatter,
} from '../../Shared/colorFormat';
import useAccounts from '../../hooks/useAccounts';
import PageLayout from '../main/PageLayout';
import { SearchTable } from '../../components';
import { ReceiptContext } from '../../contexts';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import getPayments from '../../graphql/query/getPayments';
import useTasks from '../../hooks/useTasks';
import getTasks from '../../graphql/query/getTasks';
import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import PopupPayment from '../../pubups/PopupPayment';

export default function Payment({ isRTL, words, menuitem, theme, company }) {
  const [columns] = useState([
    { name: 'time', title: words.time },
    { name: 'docNo', title: words.no },
    { name: 'creditAcc', title: words.customer },
    { name: 'debitAcc', title: isRTL ? 'حساب القبض' : 'Receipt Acc' },
    { name: 'desc', title: words.description },
    { name: 'amount', title: words.amount },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'time', width: 150 },
    { columnName: 'docNo', width: 150 },
    { columnName: 'creditAcc', width: 250 },
    { columnName: 'debitAcc', width: 250 },
    { columnName: 'desc', width: 250 },
    { columnName: 'amount', width: 150 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'time', togglingEnabled: false },
    { columnName: 'creditAcc', togglingEnabled: false },
    { columnName: 'debitAcc', togglingEnabled: false },
  ]);
  const [pageSizes] = useState([5, 10, 20, 50, 0]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const { tasks } = useTasks();
  const { height, width } = useWindowDimensions();
  const {
    state: { currentDate, currentViewName, endDate },
    dispatch,
  } = useContext(ReceiptContext);

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };

  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const [loadFinances, financeData]: any = useLazyQuery(getPayments);
  const { accounts } = useAccounts();
  const refresQuery = {
    refetchQueries: [
      {
        query: getPayments,
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
    loadFinances({
      variables,
    });
  }, [start, end]);

  const [addFinance] = useMutation(createFinance, refresQuery);
  const [editFinance] = useMutation(updateFinance, refresQuery);
  const [removeFinance] = useMutation(deleteFinance, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      removeFinance({ variables: { _id } });
      setRows(rows.filter((row: any) => row._id !== _id));
    }
  };

  useEffect(() => {
    if (financeData?.loading) {
      setLoading(true);
    }
    if (financeData?.data?.getPayments?.data) {
      const { data } = financeData.data.getPayments;
      const rdata = updateDocNumbers(data);
      setRows(rdata);
      setLoading(false);
    }
  }, [financeData]);

  const refresh = () => {
    financeData?.refetch();
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
        <Paper
          elevation={5}
          style={{
            margin: 40,
            marginTop: 80,
            overflow: 'auto',
            width: width - 330,
            // height: height - 200,
            borderRadius: 10,
          }}
        >
          <Grid rows={rows} columns={columns} getRowId={getRowId}>
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
                <Table.Row {...props} style={{ height: 60 }}></Table.Row>
              )}
              columnExtensions={tableColumnExtensions}
            />

            <TableColumnReordering
              defaultOrder={[
                'time',
                'docNo',
                'creditAcc',
                'debitAcc',
                'desc',
                'amount',
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
              for={['time']}
              formatterComponent={timeFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['amount']}
              formatterComponent={currencyFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['docNo', 'refNo']}
              formatterComponent={samllFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['creditAcc']}
              formatterComponent={(props) =>
                customerAccountFormatter(props, accounts, isRTL)
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={['debitAcc']}
              formatterComponent={(props) =>
                accountFormatter(props, accounts, isRTL)
              }
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
              addAction={addFinance}
              editAction={editFinance}
            >
              <PopupPayment company={company} tasks={tasks}></PopupPayment>
            </PopupEditing>
          </Grid>
        </Paper>
        {loading && <Loading isRTL={isRTL} />}
      </Box>
    </PageLayout>
  );
}
