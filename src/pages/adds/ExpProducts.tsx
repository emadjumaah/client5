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
import { Command, PopupEditing } from '../../Shared';
import { getRowId, updateDocNumbers } from '../../common';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  createExpenses,
  deleteExpenses,
  getExpenses,
  getProducts,
  updateExpenses,
} from '../../graphql';
import {
  accountFormatter,
  currencyFormatter,
  moneyFormat,
  samllFormatter,
  timeFormatter,
} from '../../Shared/colorFormat';
import useAccounts from '../../hooks/useAccounts';
import PageLayout from '../main/PageLayout';
import { SearchTable } from '../../components';
import { ExpensesContext } from '../../contexts';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import useTasks from '../../hooks/useTasks';
import { getColumns } from '../../common/columns';
import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import useDepartments from '../../hooks/useDepartments';
import useEmployees from '../../hooks/useEmployees';
import useResourses from '../../hooks/useResourses';
import { useProducts, useTemplate } from '../../hooks';
import PopupExpProducts from '../../pubups/PopupExpProducts';
import _ from 'lodash';

export default function ExpProducts({
  isRTL,
  words,
  menuitem,
  theme,
  company,
}) {
  const col = getColumns({ isRTL, words });

  const { tempoptions } = useTemplate();

  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          { name: 'time', title: words.time },
          col.docNo,
          { name: 'debitAcc', title: isRTL ? '???????? ??????????????' : 'Expenses Acc' },
          { name: 'creditAcc', title: isRTL ? '???????? ??????????' : 'Payment Acc' },
          col.department,
          col.employee,
          { name: 'desc', title: words.description },
          { name: 'amount', title: words.amount },
        ]
      : [
          { name: 'time', title: words.time },
          col.docNo,
          { name: 'debitAcc', title: isRTL ? '???????? ??????????????' : 'Expenses Acc' },
          { name: 'creditAcc', title: isRTL ? '???????? ??????????' : 'Payment Acc' },
          col.department,
          col.employee,
          col.contract,
          { name: 'desc', title: words.description },
          { name: 'amount', title: words.amount },
        ]
  );

  const [tableColumnExtensions]: any = useState([
    { columnName: 'time', width: 100 },
    { columnName: col.docNo.name, width: 120 },
    { columnName: 'debitAcc', width: 150 },
    { columnName: 'creditAcc', width: 150 },
    { columnName: col.department.name, width: 180 },
    { columnName: col.employee.name, width: 180 },
    { columnName: col.contract.name, width: 180 },
    { columnName: 'desc', width: 200 },
    { columnName: 'amount', width: 120 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'time', togglingEnabled: false },
    { columnName: 'creditAcc', togglingEnabled: false },
    { columnName: 'debitAcc', togglingEnabled: false },
  ]);
  const [pageSizes] = useState([5, 10, 20, 50, 0]);
  const [rows, setRows] = useState([]);
  const [sum, setSum] = useState(0);

  const [loading, setLoading] = useState(false);

  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const { tasks } = useTasks();
  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const { resourses } = useResourses();
  const { products } = useProducts();

  const { height, width } = useWindowDimensions();
  const {
    state: { currentDate, currentViewName, endDate },
    dispatch,
  } = useContext(ExpensesContext);

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };

  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const [loadExpenses, expensesData]: any = useLazyQuery(getExpenses);
  const { accounts } = useAccounts();
  const refresQuery = {
    refetchQueries: [
      {
        query: getExpenses,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
          opType: 61,
        },
      },
      { query: getProducts },
    ],
  };

  useEffect(() => {
    const variables = {
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
      opType: 61,
    };
    loadExpenses({
      variables,
    });
  }, [start, end]);

  const [addExpenses] = useMutation(createExpenses, refresQuery);
  const [editExpenses] = useMutation(updateExpenses, refresQuery);
  const [removeExpenses] = useMutation(deleteExpenses, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      removeExpenses({ variables: { _id } });
      setRows(rows.filter((row: any) => row._id !== _id));
    }
  };

  useEffect(() => {
    if (expensesData?.loading) {
      setLoading(true);
    }
    if (expensesData?.data?.getExpenses?.data) {
      const { data } = expensesData.data.getExpenses;
      const rdata = updateDocNumbers(data);
      const samount = _.sumBy(rdata, 'amount');
      setSum(samount);
      setRows(rdata);
      setLoading(false);
    }
  }, [expensesData]);

  const refresh = () => {
    expensesData?.refetch();
  };

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refresh}
      loading={loading}
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
        <Box
          style={{
            position: 'absolute',
            zIndex: 111,
            right: isRTL ? undefined : 160,
            left: isRTL ? 160 : undefined,
            bottom: 25,
          }}
        >
          <Typography style={{ fontWeight: 'bold', color: '#403795' }}>
            {isRTL ? ' ?????????????? ' : ' Total '}: {moneyFormat(sum)}
          </Typography>
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
                noData: isRTL ? '???? ???????? ????????????' : 'no data',
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
                'debitAcc',
                'creditAcc',
                col.department.name,
                col.employee.name,
                col.contract.name,
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
                accountFormatter(props, accounts, isRTL)
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
              addAction={addExpenses}
              editAction={editExpenses}
            >
              <PopupExpProducts
                resourses={resourses}
                employees={employees}
                departments={departments}
                company={company}
                servicesproducts={products}
                tasks={tasks}
              ></PopupExpProducts>
            </PopupEditing>
          </Grid>
        </Paper>
      </Box>
    </PageLayout>
  );
}
